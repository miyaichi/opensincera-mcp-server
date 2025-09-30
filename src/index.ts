#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { OpenSinceraService } from './opensincera-service.js';
import { formatPublisherWithDescriptions } from './metadata-descriptions.js';
import { z } from 'zod';

const server = new Server(
  {
    name: 'opensincera-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Input validation schemas
const GetPublisherMetadataSchema = z.object({
  publisherId: z.string().optional(),
  publisherDomain: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
}).refine(
  data => data.publisherId || data.publisherDomain,
  {
    message: "Either publisherId or publisherDomain must be provided",
  }
);

const GetPublisherByDomainSchema = z.object({
  domain: z.string().min(1),
});

const GetPublisherByIdSchema = z.object({
  publisherId: z.string().min(1),
});

// Initialize OpenSincera service
const openSinceraService = new OpenSinceraService({
  baseUrl: process.env.OPENSINCERA_BASE_URL || 'https://open.sincera.io/api',
  apiKey: process.env.OPENSINCERA_API_KEY,
  timeout: parseInt(process.env.OPENSINCERA_TIMEOUT || '10000'),
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_publisher_metadata',
        description: `Get detailed publisher metadata from OpenSincera API with comprehensive field descriptions. Requires either publisherId or publisherDomain.

Returns publisher information including:
- Basic Info: Publisher ID, name, domain, status, verification status, contact info, categories
- Performance Metrics: Ads to Content Ratio (A2CR), Ads in View, Ad Refresh Rate, Page Weight, CPU Usage
- Supply Chain: Total Supply Paths, Reseller Count, Global Publisher IDs (GPIDs)
- Identity: ID Absorption Rate

Each metric includes detailed explanations of what it measures and its business implications.`,
        inputSchema: {
          type: 'object',
          properties: {
            publisherId: {
              type: 'string',
              description: 'Publisher ID to search for',
            },
            publisherDomain: {
              type: 'string',
              description: 'Publisher domain to search for',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results to return (1-100)',
              minimum: 1,
              maximum: 100,
            },
            offset: {
              type: 'number',
              description: 'Number of results to skip',
              minimum: 0,
            },
          },
          required: [],
          additionalProperties: false,
        },
      },
      {
        name: 'get_publisher_by_domain',
        description: `Get detailed publisher information by domain name with comprehensive metric descriptions. Returns formatted data including performance metrics, supply chain information, and detailed explanations of each field's meaning and business impact.`,
        inputSchema: {
          type: 'object',
          properties: {
            domain: {
              type: 'string',
              description: 'Publisher domain to search for',
            },
          },
          required: ['domain'],
          additionalProperties: false,
        },
      },
      {
        name: 'get_publisher_by_id',
        description: `Get detailed publisher information by Publisher ID with comprehensive metric descriptions. Returns formatted data including performance metrics, supply chain information, and detailed explanations of each field's meaning and business impact.`,
        inputSchema: {
          type: 'object',
          properties: {
            publisherId: {
              type: 'string',
              description: 'Publisher ID to search for',
            },
          },
          required: ['publisherId'],
          additionalProperties: false,
        },
      },
      {
        name: 'health_check',
        description: 'Check the health status of the OpenSincera API connection',
        inputSchema: {
          type: 'object',
          properties: {},
          additionalProperties: false,
        },
      },
    ] as Tool[],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'get_publisher_metadata': {
        const input = GetPublisherMetadataSchema.parse(request.params.arguments);
        const result = await openSinceraService.getPublisherMetadata(input);

        if (result.publishers.length > 0) {
          const formattedPublishers = result.publishers.map(pub =>
            formatPublisherWithDescriptions(pub, 'en')
          ).join('\n\n---\n\n');

          return {
            content: [
              {
                type: 'text',
                text: `Found ${result.totalCount} publisher(s):\n\n${formattedPublishers}`,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: 'No publishers found matching the criteria.',
              },
            ],
          };
        }
      }

      case 'get_publisher_by_domain': {
        const input = GetPublisherByDomainSchema.parse(request.params.arguments);
        const result = await openSinceraService.getPublisherByDomain(input.domain);

        if (result) {
          const formatted = formatPublisherWithDescriptions(result, 'en');
          return {
            content: [
              {
                type: 'text',
                text: formatted,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `No publisher found for domain: ${input.domain}`,
              },
            ],
          };
        }
      }

      case 'get_publisher_by_id': {
        const input = GetPublisherByIdSchema.parse(request.params.arguments);
        const result = await openSinceraService.getPublisherById(input.publisherId);

        if (result) {
          const formatted = formatPublisherWithDescriptions(result, 'en');
          return {
            content: [
              {
                type: 'text',
                text: formatted,
              },
            ],
          };
        } else {
          return {
            content: [
              {
                type: 'text',
                text: `No publisher found for ID: ${input.publisherId}`,
              },
            ],
          };
        }
      }

      case 'health_check': {
        const result = await openSinceraService.healthCheck();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ healthy: result, timestamp: new Date().toISOString() }, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('OpenSincera MCP Server running on stdio');
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}