import axios, { AxiosInstance, AxiosResponse } from 'axios';
import https from 'https';

export interface OpenSinceraConfig {
  baseUrl: string;
  apiKey: string | undefined;
  timeout: number;
}

export interface GetPublisherMetadataRequest {
  publisherId?: string;
  publisherDomain?: string;
  limit?: number;
  offset?: number;
}

export interface PublisherMetadata {
  publisherId: string;
  publisherName: string;
  publisherDomain: string;
  status: 'active' | 'inactive' | 'suspended';
  lastUpdated: string;
  contactEmail?: string;
  categories: string[];
  verificationStatus: 'verified' | 'unverified' | 'pending';
  metadata?: {
    description?: string;
    primarySupplyType?: string;
    avgAdsToContentRatio?: number;
    avgAdsInView?: number;
    avgAdRefresh?: number;
    totalUniqueGpids?: number;
    idAbsorptionRate?: number;
    avgPageWeight?: number;
    avgCpu?: number;
    totalSupplyPaths?: number;
    resellerCount?: number;
    slug?: string;
  };
}

export interface GetPublisherMetadataResponse {
  publishers: PublisherMetadata[];
  totalCount: number;
  hasMore: boolean;
}

export interface OpenSinceraApiError {
  code: string;
  message: string;
  details?: any;
}

export class OpenSinceraService {
  private client: AxiosInstance;
  private config: OpenSinceraConfig;

  constructor(openSinceraConfig: OpenSinceraConfig) {
    this.config = openSinceraConfig;

    if (!this.config.apiKey) {
      throw new Error('OpenSincera API key is required');
    }

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        Authorization: `Bearer ${this.config.apiKey!}`,
        'User-Agent': 'OpenSincera MCP Server/1.0',
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: true,
        keepAlive: true,
        timeout: this.config.timeout,
      }),
      validateStatus: (status) => status < 500,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.error('OpenSincera API request', {
          method: config.method,
          url: config.url,
          params: config.params,
        });
        return config;
      },
      (error) => {
        console.error('OpenSincera API request error', { error: error.message });
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.error('OpenSincera API response', {
          status: response.status,
          statusText: response.statusText,
          url: response.config.url,
        });
        return response;
      },
      (error) => {
        console.error('OpenSincera API response error', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  async getPublisherMetadata(
    request: GetPublisherMetadataRequest = {}
  ): Promise<GetPublisherMetadataResponse> {
    try {
      let endpoint: string;

      if (request.publisherId) {
        endpoint = `/publishers?id=${encodeURIComponent(request.publisherId)}`;
      } else if (request.publisherDomain) {
        endpoint = `/publishers?domain=${encodeURIComponent(request.publisherDomain)}`;
      } else {
        throw new Error('Either publisherId or publisherDomain is required');
      }

      console.error('Making OpenSincera API request', {
        baseUrl: this.config.baseUrl,
        endpoint,
        headers: {
          Authorization: this.config.apiKey ? 'Bearer [REDACTED]' : 'No API key',
        },
      });

      const response: AxiosResponse<any> = await this.client.get(endpoint);

      console.error('OpenSincera API response', {
        status: response.status,
        statusText: response.statusText,
        dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        hasData: !!response.data,
      });

      if (response.status === 200) {
        const responseData = response.data;
        let publisherData: any = null;

        if (Array.isArray(responseData) && responseData.length > 0) {
          publisherData = responseData[0];
        } else if (responseData && typeof responseData === 'object' && responseData.publisher_id) {
          publisherData = responseData;
        }

        if (publisherData) {
          const mappedPublisher: PublisherMetadata = {
            publisherId: publisherData.publisher_id || publisherData.id || '',
            publisherName: publisherData.name || '',
            publisherDomain: publisherData.owner_domain || request.publisherDomain || '',
            status: this.mapStatus(publisherData.status),
            lastUpdated: publisherData.updated_at || new Date().toISOString(),
            contactEmail: publisherData.contact_email,
            categories: Array.isArray(publisherData.categories)
              ? publisherData.categories
              : publisherData.categories?.split(';') || [],
            verificationStatus: publisherData.visit_enabled ? 'verified' : 'unverified',
            metadata: {
              description: publisherData.pub_description,
              primarySupplyType: publisherData.primary_supply_type,
              avgAdsToContentRatio: publisherData.avg_ads_to_content_ratio,
              avgAdsInView: publisherData.avg_ads_in_view,
              avgAdRefresh: publisherData.avg_ad_refresh,
              totalUniqueGpids: publisherData.total_unique_gpids,
              idAbsorptionRate: publisherData.id_absorption_rate,
              avgPageWeight: publisherData.avg_page_weight,
              avgCpu: publisherData.avg_cpu,
              totalSupplyPaths: publisherData.total_supply_paths,
              resellerCount: publisherData.reseller_count,
              slug: publisherData.slug,
            },
          };

          return {
            publishers: [mappedPublisher],
            totalCount: 1,
            hasMore: false,
          };
        } else {
          return {
            publishers: [],
            totalCount: 0,
            hasMore: false,
          };
        }
      }

      if (response.status === 401) {
        throw new Error('Invalid API key or authentication failed');
      }

      if (response.status === 403) {
        throw new Error('Access forbidden - insufficient permissions');
      }

      if (response.status === 404) {
        throw new Error('Publisher not found');
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded - please try again later');
      }

      throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get publisher metadata', {
        error: errorMessage,
        request,
      });

      if (
        axios.isAxiosError(error) &&
        (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED')
      ) {
        console.error('OpenSincera API network error - check endpoint URL and connectivity', {
          domain: request.publisherDomain,
          publisherId: request.publisherId,
          baseUrl: this.config.baseUrl,
          errorCode: error.code,
        });
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          const apiError = error.response.data.error as OpenSinceraApiError;
          throw new Error(`OpenSincera API Error: ${apiError.message} (${apiError.code})`);
        }
        throw new Error(
          `HTTP ${error.response?.status}: ${error.response?.statusText || errorMessage}`
        );
      }

      throw error;
    }
  }

  private mapStatus(sinceraStatus: any): 'active' | 'inactive' | 'suspended' {
    if (typeof sinceraStatus === 'string') {
      const status = sinceraStatus.toLowerCase();
      if (status.includes('active') || status === 'live') {
        return 'active';
      } else if (status.includes('suspend')) {
        return 'suspended';
      }
    }
    return 'inactive';
  }

  async getPublisherByDomain(domain: string): Promise<PublisherMetadata | null> {
    try {
      const response = await this.getPublisherMetadata({ publisherDomain: domain, limit: 1 });
      return response.publishers.length > 0 ? response.publishers[0] : null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get publisher by domain', { domain, error: errorMessage });
      throw error;
    }
  }

  async getPublisherById(publisherId: string): Promise<PublisherMetadata | null> {
    try {
      const response = await this.getPublisherMetadata({ publisherId, limit: 1 });
      return response.publishers.length > 0 ? response.publishers[0] : null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to get publisher by ID', { publisherId, error: errorMessage });
      throw error;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/publishers?domain=test.invalid', {
        timeout: 5000,
      });

      return response.status < 500;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (
        axios.isAxiosError(error) &&
        (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED')
      ) {
        console.error('OpenSincera API not reachable', {
          error: errorMessage,
          baseUrl: this.config.baseUrl,
        });
        return false;
      }

      console.error('OpenSincera API health check encountered error but API appears reachable', {
        error: errorMessage,
        baseUrl: this.config.baseUrl,
      });
      return true;
    }
  }
}
