# OpenSincera MCP Server - Agent Documentation

This document provides guidance for AI agents and assistants on how to effectively use the OpenSincera MCP Server.

## Overview

The OpenSincera MCP Server provides access to publisher verification and metadata information through the OpenSincera API. This tool is particularly useful for analyzing digital advertising publishers, their verification status, and operational metrics.

## Common Use Cases

### Publisher Verification Analysis
- Verify if a publisher domain is legitimate and verified
- Check publisher verification status and certification
- Analyze publisher categories and content types

### Publisher Research
- Research publisher metadata for advertising partnerships
- Investigate publisher operational metrics
- Compare publisher data across different domains

### Compliance and Safety
- Verify publisher legitimacy for ad safety
- Check publisher verification status for compliance
- Analyze publisher metadata for risk assessment

## Tool Usage Guidelines

### 1. get_publisher_metadata

**Best for:** Comprehensive publisher analysis when you need detailed information.

**When to use:**
- User asks for detailed publisher information
- Need to analyze multiple aspects of a publisher
- Comparing publishers requires full metadata

**Parameters:**
- Use `publisherDomain` for domain-based searches (most common)
- Use `publisherId` when you have the specific OpenSincera publisher ID
- `limit` and `offset` for pagination (rarely needed for single queries)

**Example scenarios:**
```
User: "Tell me about the publisher example.com"
→ Use get_publisher_metadata with publisherDomain: "example.com"

User: "What's the verification status of news-site.com?"
→ Use get_publisher_metadata with publisherDomain: "news-site.com"
```

### 2. get_publisher_by_domain

**Best for:** Quick domain lookups when you only need basic information.

**When to use:**
- Simple domain verification checks
- Quick status checks
- When you need a single publisher record

**Example scenarios:**
```
User: "Is example.com a verified publisher?"
→ Use get_publisher_by_domain with domain: "example.com"

User: "Check if this domain is in OpenSincera"
→ Use get_publisher_by_domain
```

### 3. get_publisher_by_id

**Best for:** When you have a specific OpenSincera Publisher ID.

**When to use:**
- Following up on a previous search
- User provides a specific Publisher ID
- Cross-referencing with other systems

### 4. health_check

**Best for:** Troubleshooting API connectivity issues.

**When to use:**
- User reports errors with publisher lookups
- Debugging connectivity issues
- System status checks

## Response Interpretation

### Publisher Status Values
- `active`: Publisher is currently active and operational
- `inactive`: Publisher is not currently active
- `suspended`: Publisher has been suspended

### Verification Status Values
- `verified`: Publisher has been verified by OpenSincera
- `unverified`: Publisher has not been verified
- `pending`: Verification is in progress

### Key Metadata Fields

**Important for analysis:**
- `verificationStatus`: Critical for trust assessment
- `categories`: Understanding publisher content type
- `contactEmail`: Publisher contact information
- `metadata.primarySupplyType`: How ads are supplied (direct vs. reseller)
- `metadata.resellerCount`: Number of reseller relationships

**Performance metrics:**
- `metadata.avgAdsToContentRatio`: Ad density indicator
- `metadata.avgAdsInView`: User experience metric
- `metadata.totalSupplyPaths`: Advertising path diversity
- `metadata.idAbsorptionRate`: Identity resolution capability

## Error Handling Best Practices

### Common Errors and Responses

**Publisher Not Found (404)**
```
Response: "The publisher [domain] was not found in the OpenSincera database. This could mean:
- The domain is not registered with OpenSincera
- The domain may be new or not yet indexed
- There might be a typo in the domain name"
```

**Authentication Errors (401)**
```
Response: "Unable to access OpenSincera API due to authentication issues. The API key may be invalid or expired."
```

**Rate Limiting (429)**
```
Response: "OpenSincera API rate limit exceeded. Please try again in a few moments."
```

**Network Errors**
```
Response: "Unable to connect to OpenSincera API. There may be a temporary connectivity issue."
```

## Response Formatting Guidelines

### For Publisher Information
Present information in a structured, easy-to-read format:

```
Publisher: [Publisher Name]
Domain: [Publisher Domain]
Status: [Status] ([Verification Status])
Last Updated: [Date]

Categories: [List of categories]
Contact: [Contact email if available]

Key Metrics:
- Primary Supply Type: [Type]
- Ads to Content Ratio: [Ratio]
- Reseller Count: [Count]
- Verification: [Status with context]
```

### For Verification Checks
Provide clear, actionable information:

```
✅ [Domain] is verified by OpenSincera
❌ [Domain] is not verified by OpenSincera
⏳ [Domain] verification is pending
```

## Advanced Usage Patterns

### Multi-Domain Analysis
When users ask about multiple domains, use concurrent requests:

```typescript
// Good: Process multiple domains efficiently
const domains = ['site1.com', 'site2.com', 'site3.com'];
const results = await Promise.allSettled(
  domains.map(domain => get_publisher_by_domain({ domain }))
);
```

### Comparative Analysis
Structure comparisons clearly:

```
Comparing Publishers:

Publisher A (site1.com):
- Status: Active, Verified
- Categories: News, Politics
- Supply Type: Direct

Publisher B (site2.com):
- Status: Active, Unverified
- Categories: Entertainment
- Supply Type: Reseller
```

## Privacy and Security Considerations

- Never log or store API responses containing personal information
- Be mindful of rate limits to maintain service availability
- Only request necessary information - avoid excessive API calls
- Respect publisher privacy when sharing information

## Integration Tips

### With Other Tools
- Combine with DNS tools for domain verification
- Use with web scraping tools for content analysis
- Integrate with advertising safety platforms

### Performance Optimization
- Cache results for repeated queries within the same session
- Use appropriate tool based on information needed
- Handle errors gracefully to maintain user experience

## Troubleshooting Guide

### Common Issues

1. **No results for known publishers**
   - Verify domain spelling and format
   - Check if domain uses www prefix
   - Try alternative domain formats

2. **Intermittent errors**
   - Check API health status
   - Retry with exponential backoff
   - Verify network connectivity

3. **Unexpected data format**
   - Check API documentation for updates
   - Validate response structure
   - Handle missing fields gracefully

### Best Practices for Error Recovery

1. Always check health status if multiple operations fail
2. Provide helpful error messages to users
3. Suggest alternative approaches when primary method fails
4. Log errors appropriately for debugging while respecting privacy