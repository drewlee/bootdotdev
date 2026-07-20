import express, { type NextFunction, type Request, type Response } from 'express';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import {
  middlewareErrorHandler,
  middlewareLogResponse,
  middlewareMetricsInc
} from './api/middleware.js';
import { config } from './config.js';
import { cleanWords } from './utils/clean-words.js';
import { ValidationError } from './utils/custom-errors.js';

const app = express();
const PORT = 8080;
const migrationClient = postgres(config.db.url, { max: 1 });

await migrate(drizzle(migrationClient), config.db.migrationConfig);

/**
 * Handler for the GET `/admin/metrics` path.
 * Reports the collected hit metrics.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerMetrics(_: Request, res: Response, next: NextFunction): void {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(
    `<html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.fileServerHits} times!</p>
      </body>
    </html>`
  );

  next();
}

/**
 * Handler for the POST `/admin/reset` path.
 * Resets the collected hit metrics.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerReset(_: Request, res: Response, next: NextFunction): void {
  config.fileServerHits = 0;
  res.write('Hits reset to 0');
  res.end();

  next();
}

/**
 * Handler for the GET `/api/healthz` path.
 * Reports the health status of the API server.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerReadiness(_: Request, res: Response, next: NextFunction): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');

  next();
}

/**
 * Handler for the POST `/api/validate_chirp` path.
 * Validates Chirp format.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 */
function handlerValidateChirp(req: Request, res: Response, next: NextFunction): void {
  const data = req.body;

  if (!data || !data.body) {
    throw new ValidationError('Missing required `body` property');
  }

  if (data.body.length > 140) {
    throw new ValidationError('Chirp is too long. Max length is 140');
  }

  const cleanedBody = cleanWords(data.body);
  res.status(200).send(JSON.stringify({ cleanedBody }));

  next();
}

// Middleware
app.use(express.json())
app.use(middlewareLogResponse);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

// Routes
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);
app.get('/api/healthz', handlerReadiness);
app.post('/api/validate_chirp', handlerValidateChirp);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
