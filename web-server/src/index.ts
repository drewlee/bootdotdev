import express, { type NextFunction, type Request, type Response } from 'express';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import type { User } from './db/schema.js';
import {
  middlewareErrorHandler,
  middlewareLogResponse,
  middlewareMetricsInc
} from './api/middleware.js';
import { config } from './config.js';
import {
  UnauthorizedError,
  ForbiddenError
} from './utils/custom-errors.js';
import { checkPasswordHash, makeJWT, makeRefreshToken } from './utils/auth.js';
import { deleteUsers, getUserByEmail } from './db/queries/users.js';
import { saveRefreshToken } from './db/queries/refresh-tokens.js';
import {
  handlerCreateChirp,
  handlerGetAllChirps,
  handlerGetChirp,
} from './api/chirps.js';
import { handlerRefresh, handlerRevoke } from './api/refresh-token.js';
import { handlerCreateUser, handlerUpdateUser } from './api/users.js';

type UserRequest = {
  email: string;
  password: string;
};
type UserResponse = Omit<User, 'hashedPassword'>;
type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

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
 * Handler for the POST `/api/login` path.
 * Validates auth for the specified user info.
 *
 * @param req - HTTP request object.
 * @param res - HTTP response object.
 * @param next - Next middleware function to yield to.
 */
function handlerLogin(req: Request, res: Response, next: NextFunction): void {
  const { email, password }: UserRequest = req.body;
  const authError = new UnauthorizedError('Incorrect email or password');

  if (!email || !password) {
    next(authError);
    return;
  }

  getUserByEmail(email)
    .then((user) => {
      if (!user) {
        throw authError;
      }

      return checkPasswordHash(password, user.hashedPassword)
        .then((isValidPassword) => isValidPassword ? user : null);
    })
    .then((user) => {
      if (!user) {
        throw authError;
      }

      const { hashedPassword: _, ...oUser } = user;
      const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
      const refreshToken = makeRefreshToken();
      const loginResponse = {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        token,
        refreshToken,
      } satisfies LoginResponse;

      return saveRefreshToken(refreshToken, user.id)
        .then((result) => result ? loginResponse : null);
    })
    .then((loginResponse) => {
      if (!loginResponse) {
        throw authError;
      }

      res.status(200).json(loginResponse);
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
app.route('/api/users')
  .post(handlerCreateUser)
  .put(handlerUpdateUser);
app.post('/api/login', handlerLogin);
app.post('/api/refresh', handlerRefresh);
app.post('/api/revoke', handlerRevoke);

app.use(middlewareErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
