# OpenSincera MCP Server

A Model Context Protocol (MCP) server that provides access to the OpenSincera API for retrieving publisher metadata, verification information, and advertising quality analytics.

## Overview

OpenSincera is a platform that provides transparency and verification data for digital advertising publishers. This MCP server allows AI assistants and other tools to access OpenSincera's publisher information, including verification status, metadata, operational metrics, device-level ad quality signals, and competitive benchmarking.

## Features

- **Publisher Lookup**: Search for publishers by domain or Publisher ID
- **Metadata Retrieval**: Get detailed publisher information including verification status, categories, and operational metrics
- **Device-Level Metrics**: Compare mobile vs. desktop A2CR, ads in view, ad refresh rates, and more
- **Competitive Benchmarking**: Compare a publisher against similar publishers side-by-side
- **Media Evaluation**: Score and rank multiple publishers for advertiser media selection
- **Health Monitoring**: Check the status of the OpenSincera API connection
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Input Validation**: Robust input validation using Zod schemas

## Installation

Install the package globally using npm:

```bash
npm install -g opensincera-mcp-server
```

### Prerequisites

- Node.js 18.0.0 or higher
- OpenSincera API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/miyaichi/opensincera-mcp-server.git
cd opensincera-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Set up environment variables:
```bash
export OPENSINCERA_API_KEY="your-api-key-here"
export OPENSINCERA_BASE_URL="https://open.sincera.io/api"  # Optional
export OPENSINCERA_TIMEOUT="10000"  # Optional (milliseconds)
```

## Usage

### Running the Server

```bash
npm start
```

### Development

```bash
npm run dev
```

### Configuration with Claude Desktop

Add the following to your Claude Desktop configuration file, depending on your installation method.

The file is located at:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

#### Option 1: If installed globally

If you installed the package globally via `npm install -g`, the command is directly available in your system's path.

```json
{
  "mcpServers": {
    "opensincera": {
      "command": "opensincera-mcp-server",
      "env": {
        "OPENSINCERA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

#### Option 2: If using a local clone

If you cloned the repository locally, you must provide the full path to the script. **Remember to replace `/path/to/` with the actual absolute path to the project directory.**

```json
{
  "mcpServers": {
    "opensincera": {
      "command": "node",
      "args": ["/path/to/opensincera-mcp-server/dist/index.js"],
      "env": {
        "OPENSINCERA_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Example Prompts for Claude Desktop

Once configured, you can use these natural language prompts in Claude Desktop:

#### Basic Health Check
```
Check the OpenSincera API connection status
```

#### Publisher Domain Lookup
```
Get publisher information for yahoo.com from OpenSincera
```

#### Detailed Analysis Request
```
Analyze the publisher metrics for cnn.com and explain:
- Their verification status
- Ad to content ratio and what it means
- Supply chain complexity
- Overall advertising quality
```

#### Device-Level Comparison
```
Show me the mobile vs desktop ad quality metrics for nytimes.com
```

#### Competitive Benchmarking
```
Compare businessinsider.com against its similar publishers
```

#### Mobile-Focused Media Evaluation
```
Evaluate these publishers for a mobile branding campaign:
- nytimes.com
- washingtonpost.com
- reuters.com
Use device: mobile
```

#### Publisher ID Lookup
```
Get detailed information for OpenSincera Publisher ID 2737
```

#### Business Context Questions
```
I'm considering running ad campaigns on forbes.com.
Can you check their OpenSincera profile and tell me:
- Is this a verified publisher?
- What's their ad refresh rate and is it good or bad?
- How many supply paths do they have?
- Would you recommend this publisher for quality ad placement?
```

These prompts will automatically trigger the appropriate OpenSincera MCP tools and return formatted responses with detailed metric explanations.

## Available Tools

### get_publisher_metadata

Get publisher metadata from OpenSincera API.

**Parameters:**
- `publisherId` (optional): Publisher ID to search for
- `publisherDomain` (optional): Publisher domain to search for
- `limit` (optional): Maximum number of results (1-100)
- `offset` (optional): Number of results to skip

**Note:** Either `publisherId` or `publisherDomain` must be provided.

**Example:**
```json
{
  "publisherDomain": "example.com"
}
```

### get_publisher_by_domain

Get a single publisher by domain name.

**Parameters:**
- `domain` (required): Publisher domain to search for

**Example:**
```json
{
  "domain": "example.com"
}
```

### get_publisher_by_id

Get a single publisher by Publisher ID.

**Parameters:**
- `publisherId` (required): Publisher ID to search for

**Example:**
```json
{
  "publisherId": "12345"
}
```

### compare_publishers

Compare a publisher against its similar publishers (competitive benchmark). Retrieves the target publisher and its OpenSincera-curated similar publishers, then generates a side-by-side comparison of key metrics.

**Parameters:**
- `domain` (required): Publisher domain to benchmark
- `device` (optional): Device type to use for metric comparison — `overall` (default), `mobile`, or `desktop`

**Example:**
```json
{
  "domain": "businessinsider.com",
  "device": "mobile"
}
```

### evaluate_media

Score and rank multiple publisher domains for advertiser media selection. Each publisher receives a score (0–100) based on ad quality metrics, supply chain health, and identity coverage, weighted by campaign goal.

**Parameters:**
- `domains` (required): List of publisher domains to evaluate
- `campaignGoal` (optional): `branding`, `performance`, or `balanced` (default)
- `language` (optional): Output language — `en` (default) or `ja`
- `device` (optional): Device type to use for scoring — `overall` (default), `mobile`, or `desktop`

**Example:**
```json
{
  "domains": ["nytimes.com", "washingtonpost.com", "reuters.com"],
  "campaignGoal": "branding",
  "device": "desktop"
}
```

### health_check

Check the health status of the OpenSincera API connection.

**Parameters:** None

## Response Format

### Publisher Metadata Response

```json
{
  "publishers": [
    {
      "publisherId": "1",
      "publisherName": "Business Insider",
      "ownerDomain": "insider-inc.com",
      "domain": "businessinsider.com",
      "status": "active",
      "lastUpdated": "2026-04-14T01:00:25.419Z",
      "categories": [],
      "verificationStatus": "verified",
      "parentEntityId": 59072,
      "similarPublishers": [41, 67, 405],
      "deviceMetrics": {
        "mobile": {
          "avgAdsToContentRatio": 0.265,
          "maxAdsToContentRatio": 1.0,
          "minAdsToContentRatio": 0.0,
          "avgAdUnitsInView": 1.611,
          "maxAdUnitsInView": 4.0,
          "averageRefreshRate": 58.441,
          "maxRefreshRate": 420.0,
          "minRefreshRate": 5.0,
          "percentageOfAdSlotsWithRefresh": 98.78
        },
        "desktop": {
          "avgAdsToContentRatio": 0.231,
          "maxAdsToContentRatio": 1.0,
          "minAdsToContentRatio": 0.0,
          "avgAdUnitsInView": 2.577,
          "maxAdUnitsInView": 9.0,
          "averageRefreshRate": 81.096,
          "maxRefreshRate": 590.0,
          "minRefreshRate": 5.0,
          "percentageOfAdSlotsWithRefresh": 84.99
        }
      },
      "metadata": {
        "description": "Business Insider tells the global tech, finance...",
        "primarySupplyType": "web",
        "avgAdsToContentRatio": 0.249,
        "avgAdsInView": 2.088,
        "avgAdRefresh": 72.489,
        "totalUniqueGpids": 946,
        "idAbsorptionRate": 0.5,
        "avgPageWeight": 27.843,
        "avgCpu": 254.671,
        "totalSupplyPaths": 118,
        "resellerCount": 69,
        "slug": "business-insider"
      }
    }
  ],
  "totalCount": 1,
  "hasMore": false
}
```

### Health Check Response

```json
{
  "healthy": true,
  "timestamp": "2026-04-14T10:00:00Z"
}
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OPENSINCERA_API_KEY` | Your OpenSincera API key | - | Yes |
| `OPENSINCERA_BASE_URL` | OpenSincera API base URL | `https://open.sincera.io/api` | No |
| `OPENSINCERA_TIMEOUT` | Request timeout in milliseconds | `10000` | No |

## Error Handling

The server provides comprehensive error handling for common scenarios:

- **Authentication errors** (401): Invalid or missing API key
- **Authorization errors** (403): Insufficient permissions
- **Not found errors** (404): Publisher not found
- **Rate limiting** (429): API rate limit exceeded
- **Network errors**: Connection issues or timeouts
- **Validation errors**: Invalid input parameters

## Development

### Scripts

- `npm run build` - Build the TypeScript project
- `npm run dev` - Run in development mode with hot reload
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
src/
├── index.ts                 # Main MCP server entry point and tool definitions
├── opensincera-service.ts   # OpenSincera API client and data models
├── metadata-descriptions.ts # Field descriptions and formatted output
└── analysis.ts              # Scoring, comparison, and evaluation logic
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues related to this MCP server, please open an issue on GitHub.

For OpenSincera API issues, please contact OpenSincera support directly.

## Changelog

### v1.0.4
- Added `device_level_metrics` support: mobile and desktop breakdowns for A2CR, ads in view, ad refresh rate (avg/min/max), and percentage of ad slots with refresh
- Added `compare_publishers` tool: side-by-side competitive benchmark against similar publishers
- Added `evaluate_media` tool: score and rank multiple publishers by campaign goal (branding/performance/balanced)
- Added `device` parameter to `compare_publishers` and `evaluate_media` for mobile/desktop-specific analysis
- Added `analysis.ts` module for scoring and reporting logic

### v1.0.3
- Added publisher comparison and rating features
- Updated publisher metadata structure with `owner_domain`, `domain`, `parent_entity_id`, and `similar_publishers`

### v1.0.2
- Version bump and stability improvements

### v1.0.0
- Initial release
- Basic publisher lookup functionality
- Health check endpoint
- Comprehensive error handling
- Input validation
