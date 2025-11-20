const express = require('express');
const app = express();
const port = process.env['PORT'] || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'A4CO Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`A4CO Backend listening on port ${port}`);
});
