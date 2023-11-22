// app.js
const express = require('express');
const app = express();
const port = 3000;

// Import prom-client
const prometheus = require('prom-client');

// Enable the collection of default metrics
prometheus.collectDefaultMetrics();

app.get('/', (req, res) => {
  // Increase a counter each time the / endpoint is hit
  prometheus.defaultMetrics.httpRequestsTotal.inc();

  // Simulate processing time with a delay
  const start = Date.now();
  setTimeout(() => {
    const end = Date.now();

    // Record the duration of the request
    prometheus.defaultMetrics.httpRequestDurationMicroseconds.observe({ path: '/' }, end - start);

    res.send('Hello, this is your sample Node.js app!');
  }, 100);
});

// Expose metrics endpoint for Prometheus to scrape
app.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType);
  res.end(prometheus.register.metrics());
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
