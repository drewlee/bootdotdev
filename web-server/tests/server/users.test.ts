import request from 'supertest';
import { testDB } from './test-db.js';
import { createUserRecord, getAuthToken } from './helpers.js';
import { db } from 'src/db/index.js';
import { deleteUsers, getUserByEmail } from 'src/db/queries/users.js';
import { checkPasswordHash } from 'src/utils/auth.js';
import app from 'src/app.js';

vi.mock(import('../../src/db/index.js'), () => ({
  db: testDB as unknown as typeof db,
}));

const user = { email: 'james.t.kirk@starfleet.com', password: 'enterprise' };

describe('/api/users', () => {
  afterEach(async () => {
    await deleteUsers();
  });

  describe('POST creation', () => {
    test('Handles creating a new user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(user)
        .expect('Content-Type', /json/)
        .expect(201);

      const { email, id } = response.body;

      expect(email).toBe(user.email);
      expect(id).not.toBeUndefined();
    });

    test('Responds with 400 error if email is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send({ ...user, email: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('Responds with 400 error if password is missing', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Accept', 'application/json')
        .send({ ...user, password: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });
  });

  describe('PUT update', () => {
    let authHeader: string;

    beforeEach(async () => {
      const record = await createUserRecord(user);
      authHeader = getAuthToken(record.id);
    });

    test("Handles updating the user's email", async () => {
      const newEmail = 'kirk@gmail.com';

      await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', authHeader)
        .send({ ...user, email: newEmail })
        .expect('Content-Type', /json/)
        .expect(200);

      const result = await getUserByEmail(newEmail);
      expect(result.email).toBe(newEmail);
    });

    test("Handles updating the user's password", async () => {
      const newPassword = 'excelsior';

      await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', authHeader)
        .send({ ...user, password: newPassword })
        .expect('Content-Type', /json/)
        .expect(200);

      const result = await getUserByEmail(user.email);
      expect(checkPasswordHash(newPassword, result.hashedPassword)).toBeTruthy();
    });

    test('Throws 401 error if auth header is not set', async () => {
      const newEmail = 'kirk@gmail.com';

      const response = await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .send({ ...user, email: newEmail })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({ error: 'Malformed authorization header' });
    });

    test('Throws 401 error if auth header is malformed', async () => {
      const newEmail = 'kirk@gmail.com';

      const response = await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', authHeader.replace('Bearer ', ''))
        .send({ ...user, email: newEmail })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({ error: 'Malformed authorization header' });
    });

    test('Throws 401 error for invalid auth token', async () => {
      const newEmail = 'kirk@gmail.com';

      const response = await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer abcdefghijklmnop')
        .send({ ...user, email: newEmail })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({ error: 'Invalid token' });
    });

    test('Responds with 400 error if email is missing', async () => {
      const response = await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', authHeader)
        .send({ ...user, email: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    test('Responds with 400 error if password is missing', async () => {
      const response = await request(app)
        .put('/api/users')
        .set('Accept', 'application/json')
        .set('Authorization', authHeader)
        .send({ ...user, password: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required fields' });
    });
  });
});
