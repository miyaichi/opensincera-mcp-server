# OpenSincera MCP Server

A Model Context Protocol (MCP) server that provides access to the OpenSincera API for retrieving publisher metadata and verification information.

## Overview

OpenSincera is a platform that provides transparency and verification data for digital advertising publishers. This MCP server allows AI assistants and other tools to access OpenSincera's publisher information, including verification status, metadata, and operational metrics.

## Features

- **Publisher Lookup**: Search for publishers by domain or Publisher ID
- **Metadata Retrieval**: Get detailed publisher information including verification status, categories, and operational data
- **Health Monitoring**: Check the status of the OpenSincera API connection
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Input Validation**: Robust input validation using Zod schemas

## Installation

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

Add the following to your Claude Desktop configuration file:

#### macOS
`~/Library/Application Support/Claude/claude_desktop_config.json`

#### Windows
`%APPDATA%/Claude/claude_desktop_config.json`

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

#### Multiple Domain Comparison
```
Compare the following publishers using OpenSincera data:
- nytimes.com
- washingtonpost.com
- reuters.com

Focus on their verification status, ad quality metrics, and supply chain efficiency.
```

#### Publisher ID Lookup
```
Get detailed information for OpenSincera Publisher ID 2737
```

#### Targeted Metric Analysis
```
For the domain example.com, explain:
- What is their ID Absorption Rate and why does it matter?
- How does their page weight affect ad performance?
- Are they using too many resellers?
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

### health_check

Check the health status of the OpenSincera API connection.

**Parameters:** None

## Response Format

### Publisher Metadata Response

```json
{
  "publishers": [
    {
      "publisherId": "12345",
      "publisherName": "Example Publisher",
      "publisherDomain": "example.com",
      "status": "active",
      "lastUpdated": "2023-12-01T10:00:00Z",
      "contactEmail": "contact@example.com",
      "categories": ["News", "Entertainment"],
      "verificationStatus": "verified",
      "metadata": {
        "description": "A leading news publisher",
        "primarySupplyType": "direct",
        "avgAdsToContentRatio": 0.25,
        "avgAdsInView": 3.2,
        "avgAdRefresh": 1.5,
        "totalUniqueGpids": 150,
        "idAbsorptionRate": 0.85,
        "avgPageWeight": 2048,
        "avgCpu": 15.5,
        "totalSupplyPaths": 12,
        "resellerCount": 8,
        "slug": "example-publisher"
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
  "timestamp": "2023-12-01T10:00:00Z"
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
├── index.ts                 # Main MCP server entry point
├── metadata-descriptions.ts # Descriptions for metadata fields
└── opensincera-service.ts   # OpenSincera API service implementation
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

### v1.0.0
- Initial release
- Basic publisher lookup functionality
- Health check endpoint
- Comprehensive error handling
- Input validation