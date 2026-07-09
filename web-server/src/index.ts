import express, { type NextFunction, type Request, type Response } from 'express';
import { middlewareLogResponse, middlewareMetricsInc } from './api/middleware.js';
import { config } from './config.js';

const app = express();
const PORT = 8080;

function handlerReadiness(req: Request, res: Response): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');
}

function handlerMetrics(_: Request, res: Response): void {
  res.send(`Hits: ${config.fileServerHits}`);
}

function handlerReset(_: Request, res: Response): void {
  config.fileServerHits = 0;
  res.write('Hits reset to 0');
  res.end();
}

app.use(middlewareLogResponse);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.get('/healthz', handlerReadiness);
app.get('/metrics', handlerMetrics);
app.get('/reset', handlerReset);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
