import request from 'supertest';
import { testDB } from './lib/test-db.js';
import { db } from 'src/db/index.js';
import { deleteUsers } from 'src/db/queries/users.js';
import { createUserRecord } from './lib/helpers.js';
import app from 'src/app.js';

vi.mock(import('../../src/db/index.js'), () => ({
  db: testDB as unknown as typeof db,
}));

const user = { email: 'james.t.kirk@starfleet.com', password: 'enterprise' };

describe('/api/login', () => {
  beforeEach(async () => {
    await createUserRecord(user);
  });

  afterEach(async () => {
    await deleteUsers();
  });

  test('Handles logging in a user', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body.token).toBeTruthy();
  });

  test('Responds with 401 error when email is missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ ...user, email: '' })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid email or password' });
  });

  test('Responds with 401 error when password is missing', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ ...user, password: '' })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid email or password' });
  });

  test('Responds with 401 error when email is invalid', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ ...user, email: 'spock@starfleet.com' })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid email or password' });
  });

  test('Responds with 401 error when password is invalid', async () => {
    const response = await request(app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ ...user, password: 'excelsior' })
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ error: 'Invalid email or password' });
  });
});
