import express, { Request, Response } from 'express';

const app = express();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'A4CO Backend API',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

const server = await app.listen(port);
console.log(`Server running on port ${port}`);
