import crypto from 'crypto';

import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'tu_secret_aqui'; // Reemplaza con tu secret real

app.use(express.json());

// Middleware para verificar la firma de GitHub
function verifySignature(req: express.Request, res: express.Response, next: express.NextFunction) {
  const signature = req.get('X-Hub-Signature-256');
  if (!signature) {
    return res.status(401).send('No signature');
  }

  const body = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const expectedSignature = `sha256=${hmac.update(body).digest('hex')}`;

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return res.status(401).send('Invalid signature');
  }

  next();
}

// Ruta para webhooks
app.post('/webhook', verifySignature, (req, res) => {
  const event = req.get('X-GitHub-Event');

  if (event === 'ping') {
    return res.status(200).send('pong');
  }

  // Aquí puedes añadir lógica para otros eventos como push, pull_request, etc.
  // Por ejemplo:
  // if (event === 'push') { /* lógica para push */ }
  // if (event === 'pull_request') { /* lógica para PR */ }

  res.status(200).send('Event processed');
});

// Ruta de health check
app.get('/', (req, res) => {
  res.send('GitHub App Webhook Server is running');
});

app.listen(PORT, () => {
  // Server started
});
