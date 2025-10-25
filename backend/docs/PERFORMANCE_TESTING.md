# Performance Testing Guide

## Overview

This guide explains how to run performance tests on the GIIP Backend API to measure throughput, response times, and cache effectiveness.

## Running Performance Tests

### Basic Test (Public Endpoints Only)

```bash
node backend/test-performance.js
```

This tests public endpoints (`/api/health` and `/`) without authentication.

### Test with Authentication

To test authenticated endpoints (news, events, conferences), you need a valid JWT token:

1. **Get a JWT token:**
   ```bash
   # Register a user
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   
   # Login to get token
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123!"}'
   ```

2. **Run test with token:**
   ```bash
   JWT_TOKEN="your_jwt_token_here" node backend/test-performance.js
   ```

### Custom Configuration

```bash
# Test with 100 concurrent requests for 30 seconds
CONCURRENT_REQUESTS=100 TEST_DURATION_MS=30000 node backend/test-performance.js

# Test against production
API_URL=https://api.example.com JWT_TOKEN="token" node backend/test-performance.js

# Combined
CONCURRENT_REQUESTS=200 TEST_DURATION_MS=60000 API_URL=http://localhost:3000 node backend/test-performance.js
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_URL` | `http://localhost:3000` | Base URL of the API to test |
| `CONCURRENT_REQUESTS` | `50` | Number of concurrent request loops |
| `TEST_DURATION_MS` | `10000` | Test duration in milliseconds |
| `JWT_TOKEN` | (none) | JWT token for authenticated endpoints |

## Understanding the Results

### Request Statistics

- **Total Requests:** Total number of requests made during the test
- **Successful:** Requests with 2xx status codes
- **Failed:** Requests with errors or non-2xx status codes
- **Requests/sec:** Throughput (total requests / test duration)

### Response Time Metrics

- **Average:** Mean response time across all requests
- **Min/Max:** Fastest and slowest response times
- **P50 (Median):** 50% of requests completed faster than this
- **P95:** 95% of requests completed faster than this
- **P99:** 99% of requests completed faster than this

### Cache Performance

- **Cache Hits:** Responses served from cache
- **Cache Misses:** Responses generated fresh
- **Hit Rate:** Percentage of requests served from cache

### Performance Assessment

The test automatically assesses performance:

- **EXCELLENT:** Avg < 100ms, Success > 99%
- **GOOD:** Avg < 500ms, Success > 95%
- **FAIR:** Avg < 1000ms, Success > 90%
- **POOR:** Above thresholds

## Expected Performance

### With Caching (Warm Cache)

- Average response time: **< 50ms**
- P95 response time: **< 100ms**
- P99 response time: **< 200ms**
- Throughput: **> 500 req/s**
- Success rate: **> 99%**
- Cache hit rate: **> 80%**

### Without Caching (Cold Cache)

- Average response time: **< 200ms**
- P95 response time: **< 500ms**
- P99 response time: **< 1000ms**
- Throughput: **> 100 req/s**
- Success rate: **> 99%**

## Testing Cache Effectiveness

To test cache effectiveness:

1. **First run (cold cache):**
   ```bash
   node backend/test-performance.js
   ```
   Note the response times and cache misses.

2. **Second run (warm cache):**
   ```bash
   node backend/test-performance.js
   ```
   You should see:
   - Significantly lower response times
   - High cache hit rate (> 80%)
   - Higher throughput

## Troubleshooting

### High Response Times

1. Check if the server is running: `curl http://localhost:3000/api/health`
2. Check database connection
3. Monitor server resources (CPU, memory)
4. Check for slow queries in server logs

### Low Cache Hit Rate

1. Verify cache is enabled in server.js
2. Check cache TTL settings
3. Ensure you're testing the same endpoints repeatedly
4. Check cache statistics: `curl http://localhost:3000/api/health`

### Connection Errors

1. Verify API_URL is correct
2. Check if server is running
3. Check firewall settings
4. Verify network connectivity

### High Failure Rate

1. Check server logs for errors
2. Verify JWT token is valid (if testing authenticated endpoints)
3. Check database connection
4. Monitor server resources

## Advanced Testing

### Load Testing

Test with increasing load to find breaking points:

```bash
# Light load
CONCURRENT_REQUESTS=10 node backend/test-performance.js

# Medium load
CONCURRENT_REQUESTS=50 node backend/test-performance.js

# Heavy load
CONCURRENT_REQUESTS=100 node backend/test-performance.js

# Stress test
CONCURRENT_REQUESTS=200 node backend/test-performance.js
```

### Endurance Testing

Test system stability over time:

```bash
# Run for 5 minutes
TEST_DURATION_MS=300000 node backend/test-performance.js

# Run for 30 minutes
TEST_DURATION_MS=1800000 node backend/test-performance.js
```

### Spike Testing

Test system response to sudden load spikes:

```bash
# Normal load for baseline
CONCURRENT_REQUESTS=20 node backend/test-performance.js

# Sudden spike
CONCURRENT_REQUESTS=200 TEST_DURATION_MS=5000 node backend/test-performance.js

# Back to normal
CONCURRENT_REQUESTS=20 node backend/test-performance.js
```

## Continuous Performance Monitoring

### Automated Testing

Add to CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Performance Test
  run: |
    npm start &
    sleep 5
    node backend/test-performance.js
    if [ $? -ne 0 ]; then exit 1; fi
```

### Performance Regression Detection

Compare results over time:

```bash
# Save baseline
node backend/test-performance.js > baseline.txt

# After changes
node backend/test-performance.js > current.txt

# Compare
diff baseline.txt current.txt
```

## Best Practices

1. **Consistent Environment:** Always test in the same environment
2. **Warm-up Period:** Run a short test first to warm up caches
3. **Multiple Runs:** Run tests multiple times and average results
4. **Realistic Load:** Test with realistic concurrent user counts
5. **Monitor Resources:** Watch CPU, memory, and database during tests
6. **Document Results:** Keep records of performance test results
7. **Test After Changes:** Run performance tests after code changes

## Additional Tools

For more comprehensive testing, consider:

- **Apache JMeter:** GUI-based load testing
- **k6:** Modern load testing tool
- **Artillery:** Modern, powerful load testing toolkit
- **Gatling:** High-performance load testing framework

## Example Test Scenarios

### Scenario 1: API Health Check

```bash
# Test health endpoint performance
API_URL=http://localhost:3000 \
CONCURRENT_REQUESTS=100 \
TEST_DURATION_MS=10000 \
node backend/test-performance.js
```

### Scenario 2: Content API Load

```bash
# Get JWT token first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!"}' \
  | jq -r '.token')

# Test content endpoints
JWT_TOKEN="$TOKEN" \
CONCURRENT_REQUESTS=50 \
TEST_DURATION_MS=30000 \
node backend/test-performance.js
```

### Scenario 3: Cache Effectiveness

```bash
# First run - cold cache
echo "=== Cold Cache Test ==="
node backend/test-performance.js

# Wait a moment
sleep 2

# Second run - warm cache
echo "=== Warm Cache Test ==="
node backend/test-performance.js
```

## Support

For issues or questions about performance testing:
1. Check server logs: `docker-compose logs api`
2. Review performance optimization guide: `backend/docs/PERFORMANCE_OPTIMIZATION.md`
3. Check database performance: `docker-compose exec db psql -U giip_user -d giip_db -c "SELECT * FROM pg_stat_activity;"`
