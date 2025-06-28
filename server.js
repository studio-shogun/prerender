#!/usr/bin/env node
var prerender = require('./lib');

// Configure server with Render.com optimizations
var server = prerender({
  // Use Chrome location that works on Render
  chromeLocation: process.env.CHROME_BIN || '/usr/bin/google-chrome',
  
  // Worker configuration
  workers: process.env.PRERENDER_NUM_WORKERS || 4,
  iterations: process.env.PRERENDER_NUM_ITERATIONS || 40,
  softIterations: process.env.PRERENDER_NUM_SOFT_ITERATIONS || 30,
  
  // Enable features needed for Cloudflare
  cookiesEnabled: true,
  logRequests: true,
  followRedirects: false,
  
  // Chrome flags optimized for Render.com container environment
  chromeFlags: [
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-zygote',
    '--deterministic-fetch',
    '--disable-features=VizDisplayCompositor',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding'
  ],
});

// Basic Auth middleware if token is provided
if (process.env.PRERENDER_TOKEN) {
  server.use(prerender.basicAuth());
}

// Core middleware
server.use(prerender.sendPrerenderHeader());
server.use(prerender.blockResources());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

// Memory cache for performance optimization
// Configure via environment variables: CACHE_TTL (seconds) and CACHE_MAXSIZE
server.use(require('prerender-memory-cache'));

server.start();
