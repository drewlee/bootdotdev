import express, { type NextFunction, type Request, type Response } from 'express';
import type { User } from './db/schema.js';
import { getUserByEmail } from './db/queries/users.js';
import { saveRefreshToken } from './db/queries/refresh-tokens.js';
import config from './config.js';
import {
  middlewareErrorHandler,
  middlewareLogResponse,
  middlewareMetricsInc,
} from './api/middleware.js';
import { handlerReadiness } from './api/health.js';
import { handlerMetrics, handlerReset } from './api/admin.js';
import { UnauthorizedError } from './utils/custom-errors.js';
import { checkPasswordHash, makeJWT, makeRefreshToken } from './utils/auth.js';
import {
  handlerCreateChirp,
  handlerGetAllChirps,
  handlerGetChirp,
  handlerDeleteChirp,
} from './api/chirps.js';
import { handlerRefresh, handlerRevoke } from './api/refresh-token.js';
import { handlerCreateUser, handlerUpdateUser } from './api/users.js';
import { handlerPolkaWebhook } from './api/webhooks.js';

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

      return checkPasswordHash(password, user.hashedPassword).then((isValidPassword) =>
        isValidPassword ? user : null,
      );
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
        isChirpyRed: user.isChirpyRed,
        token,
        refreshToken,
      } satisfies LoginResponse;

      return saveRefreshToken(refreshToken, user.id).then((result) =>
        result ? loginResponse : null,
      );
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
app.use(express.json());
app.use(middlewareLogResponse);
app.use('/', middlewareMetricsInc, express.static('./src/app'));

// Routes
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerReset);
app.get('/api/health', handlerReadiness);
app.route('/api/chirps').get(handlerGetAllChirps).post(handlerCreateChirp);
app.route('/api/chirps/:chirpId').get(handlerGetChirp).delete(handlerDeleteChirp);
app.route('/api/users').post(handlerCreateUser).put(handlerUpdateUser);
app.post('/api/login', handlerLogin);
app.post('/api/refresh', handlerRefresh);
app.post('/api/revoke', handlerRevoke);
app.post('/api/polka/webhooks', handlerPolkaWebhook);

app.use(middlewareErrorHandler);

export default app;
