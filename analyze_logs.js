import { readFileSync, writeFileSync } from 'fs';

// Read and parse the log file
const logs = JSON.parse(readFileSync('sample_api_logs.json', 'utf-8'));

// Most active IPs
const ipCount = {};
logs.forEach(log => { ipCount[log.ip] = (ipCount[log.ip] || 0) + 1; });
const mostActiveIps = Object.entries(ipCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([ip, count]) => ({ ip, count }));

// Top 5 API endpoints
const endpointCount = {};
logs.forEach(log => { endpointCount[log.endpoint] = (endpointCount[log.endpoint] || 0) + 1; });
const topEndpoints = Object.entries(endpointCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([endpoint, count]) => ({ endpoint, count }));

// 5xx errors
const errors5xx = logs.filter(log => log.status >= 500 && log.status < 600)
  .map(log => ({
    timestamp: log.timestamp,
    ip: log.ip,
    endpoint: log.endpoint,
    status: log.status
  }));

// Output summary
const summary = {
  most_active_ips: mostActiveIps,
  top_endpoints: topEndpoints,
  flagged_5xx_errors: errors5xx
};

writeFileSync('sample_output.json', JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
