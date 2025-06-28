#!/usr/bin/env node
var prerender = require('./lib');

// Configure server with Render.com optimizations
var server = prerender({
  chromeLocation: process.env.CHROME_BIN || '/opt/render/project/.render/chrome/opt/google/chrome/chrome',
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
