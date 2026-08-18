import express from 'express';
import {
  middlewareErrorHandler,
  middlewareLogResponse,
  middlewareMetricsInc,
} from './api/middleware.js';
import { handlerReadiness } from './api/health.js';
import { handlerMetrics, handlerReset } from './api/admin.js';
import { handlerLogin } from './api/login.js';
import { handlerCreateUser, handlerUpdateUser } from './api/users.js';
import {
  handlerCreateChirp,
  handlerGetAllChirps,
  handlerGetChirp,
  handlerDeleteChirp,
} from './api/chirps.js';
import { handlerRefresh, handlerRevoke } from './api/refresh-token.js';
import { handlerPolkaWebhook } from './api/webhooks.js';

const app = express();

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
