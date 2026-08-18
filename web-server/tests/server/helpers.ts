import request from 'supertest';
import { hashPassword } from 'src/utils/auth.js';
import { createUser } from 'src/db/queries/users.js';
import { makeJWT } from 'src/utils/auth.js';
import config from 'src/config.js';
import app from 'src/app.js';

type Credentials = { email: string; password: string };

export async function createUserRecord(
  user: Credentials,
): Promise<ReturnType<typeof createUser>> {
  const { email, password } = user;
  const hashedPassword = await hashPassword(password);
  const response = await createUser({ email, hashedPassword });

  return response;
}

export async function loginUser(user: Credentials): Promise<string> {
  const response = await request(app).post('/api/login').send(user);
  return response.body.token;
}

export function getAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

export function getAuthToken(userId: string): string {
  const token = makeJWT(userId, config.jwt.defaultDuration, config.jwt.secret);
  const authHeader = getAuthHeader(token);

  return authHeader;
}
