import express, { type Request, type Response } from 'express';
import { middlewareLogResponse, middlewareMetricsInc } from './api/middleware.js';
import { config } from './config.js';

const app = express();
const PORT = 8080;

/**
 * Handler for the GET `/admin/metrics` path.
 * Reports the collected hit metrics.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerMetrics(_: Request, res: Response): void {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(
    `<html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileServerHits} times!</p>
      </body>
    </html>`
  );
}

/**
 * Handler for the POST `/admin/reset` path.
 * Resets the collected hit metrics.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerReset(_: Request, res: Response): void {
  config.fileServerHits = 0;
  res.write('Hits reset to 0');
  res.end();
}

/**
 * Handler for the GET `/api/healthz` path.
 * Reports the health status of the API server.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerReadiness(_: Request, res: Response): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');
}

// Middleware
app.use(middlewareLogResponse);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

// Routes
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);
app.get('/api/healthz', handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
