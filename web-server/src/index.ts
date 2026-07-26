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
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError
} from './utils/custom-errors.js';
import { hashPassword, checkPasswordHash } from './utils/auth.js';
import { createUser, deleteUsers, getUserByEmail } from './db/queries/users.js';
import {
  handlerCreateChirp,
  handlerGetAllChirps,
  handlerGetChirp,
} from './api/chirps.js';

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
 * @param next - Next middleware function to yield to.
 */
function handlerMetrics(_: Request, res: Response, next: NextFunction): void {
  res.set('Content-Type', 'text/html; charset=utf-8');
  res.send(
    `<html>
      <body>
        <h1>Welcome, Chirpy Admin</h1>
        <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
      </body>
    </html>`
  );

  next();
}

/**
 * Handler for the POST `/admin/reset` path.
 * Resets the collected hit metrics & deletes all user records.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
function handlerReset(_: Request, res: Response, next: NextFunction): void {
  if (config.api.platform !== 'dev') {
    next(new ForbiddenError('Reset is only allowed in dev environment'));
    return;
  }

  deleteUsers()
    .then(() => {
      config.api.fileServerHits = 0;

      res.write('Hits reset to 0');
      res.end();
      next();
    })
    .catch(next);
}

/**
 * Handler for the GET `/api/healthz` path.
 * Reports the health status of the API server.
 *
 * @param _ - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
function handlerReadiness(_: Request, res: Response, next: NextFunction): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');

  next();
}

/**
 * Handler for the POST `/api/users` path.
 * Creates a new record for the specified user.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
function handlerCreateUser(req: Request, res: Response, next: NextFunction): void {
  const { email, password }: { email: string, password: string } = req.body;

  if (!email || !password) {
    next(new BadRequestError('Missing required properties'));
    return;
  }

  hashPassword(password)
    .then((hashedPassword) => createUser({ email, hashedPassword }))
    .then((user) => {
      if (!user) {
        throw new Error('Failed to create new user');
      }

      const { hashedPassword: _, ...nUser } = user;

      res.status(201).json(nUser);
      next();
    })
    .catch(next);
}

/**
 * Handler for the POST `/api/login` path.
 * Validates auth for the specified user info.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
function handlerLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password }: { email: string, password: string } = req.body;
  const authError = new UnauthorizedError('Incorrect email or password');

  if (!email || !password) {
    next(authError);
    return;
  }

  getUserByEmail(email)
    .then((user) => {
      const isValidPassword = checkPasswordHash(password, user.hashedPassword);
      return Promise.all([isValidPassword, user]);
    })
    .then(([isValidPassword, user]) => {
      if (!isValidPassword) {
        throw authError;
      }

      const { hashedPassword: _, ...nUser } = user;

      res.status(200).json(nUser);
      next();
    })
    .catch(next);
}

// Middleware
app.use(express.json())
app.use(middlewareLogResponse);
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

// Routes
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);
app.get('/api/healthz', handlerReadiness);
app.route('/api/chirps')
  .get(handlerGetAllChirps)
  .post(handlerCreateChirp);
app.get('/api/chirps/:chirpId', handlerGetChirp);
app.post('/api/users', handlerCreateUser);
app.post('/api/login', handlerLogin);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
