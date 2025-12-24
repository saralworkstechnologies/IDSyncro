const fs = require('fs');
const path = require('path');

// Simple monitoring stats
const stats = {
  startTime: Date.now(),
  requests: {
    total: 0,
    success: 0,
    errors: 0,
    byEndpoint: {}
  },
  security: {
    rateLimitHits: 0,
    invalidRequests: 0
  }
};

// Middleware to track stats
function trackRequest(req, res, next) {
  stats.requests.total++;
  
  const endpoint = `${req.method} ${req.path}`;
  stats.requests.byEndpoint[endpoint] = (stats.requests.byEndpoint[endpoint] || 0) + 1;
  
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      stats.requests.success++;
    } else if (res.statusCode >= 400) {
      stats.requests.errors++;
    }
  });
  
  next();
}

// Get monitoring stats
function getStats() {
  const uptime = Date.now() - stats.startTime;
  const uptimeHours = (uptime / (1000 * 60 * 60)).toFixed(2);
  
  return {
    uptime: `${uptimeHours} hours`,
    uptimeMs: uptime,
    requests: stats.requests,
    security: stats.security,
    errorRate: ((stats.requests.errors / stats.requests.total) * 100).toFixed(2) + '%',
    topEndpoints: Object.entries(stats.requests.byEndpoint)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }))
  };
}

// Read recent logs
function getRecentLogs(logType = 'combined', lines = 50) {
  try {
    const logPath = path.join(__dirname, 'logs', `${logType}.log`);
    if (!fs.existsSync(logPath)) return [];
    
    const content = fs.readFileSync(logPath, 'utf8');
    const logLines = content.trim().split('\n').filter(line => line);
    
    return logLines.slice(-lines).map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return { message: line };
      }
    }).reverse();
  } catch (error) {
    return [];
  }
}

// Increment security counter
function trackSecurityEvent(type) {
  if (type === 'rateLimit') {
    stats.security.rateLimitHits++;
  } else if (type === 'invalid') {
    stats.security.invalidRequests++;
  }
}

module.exports = {
  trackRequest,
  getStats,
  getRecentLogs,
  trackSecurityEvent
};
