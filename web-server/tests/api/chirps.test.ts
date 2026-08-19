import request from 'supertest';
import { testDB } from './lib/test-db.js';
import { db } from 'src/db/index.js';
import { deleteUsers } from 'src/db/queries/users.js';
import { getChirpById } from 'src/db/queries/chirps.js';
import { createUserRecord, createChirpRecord, getAuthToken } from './lib/helpers.js';
import app from 'src/app.js';

vi.mock(import('../../src/db/index.js'), () => ({
  db: testDB as unknown as typeof db,
}));

const data = [
  {
    user: {
      email: 'james.t.kirk@starfleet.com',
      password: 'enterprise',
    },
    chirps: [
      'These are the voyages...',
      'Beam me up, Scotty',
      "Don't get me started with the Klingons!",
    ],
  },
  {
    user: {
      email: 'spoclk@starfleet.com',
      password: 'logical',
    },
    chirps: ['Pure energy!', 'Fascinating...'],
  },
];

describe('/api/chirps', () => {
  const userIDs: string[] = [];
  const chirpIDs: string[] = [];

  beforeEach(async () => {
    for (const entry of data) {
      const userRecord = await createUserRecord(entry.user);
      const userId = userRecord.id;
      userIDs.push(userId);

      for (const chirp of entry.chirps) {
        const chirpRecord = await createChirpRecord(chirp, userId);
        chirpIDs.push(chirpRecord.id);
      }
    }
  });

  afterEach(async () => {
    userIDs.splice(0);
    chirpIDs.splice(0);
    await deleteUsers();
  });

  describe('POST creation', () => {
    test('Handles creating a new chirp', async () => {
      const body = 'Searching for spock';

      const response = await request(app)
        .post('/api/chirps')
        .set('Authorization', getAuthToken(userIDs[0]))
        .set('Accept', 'application/json')
        .send({ body })
        .expect('Content-Type', /json/)
        .expect(201);

      const result = response.body;

      expect(result.body).toEqual(body);
      expect(result.userId).toBe(userIDs[0]);
    });

    test('Responds with 400 error if body is missing', async () => {
      const response = await request(app)
        .post('/api/chirps')
        .set('Authorization', getAuthToken(userIDs[0]))
        .set('Accept', 'application/json')
        .send({ body: '' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Missing required field' });
    });

    test('Responds with 401 error if token is invalid', async () => {
      const body = 'Searching for spock';

      const response = await request(app)
        .post('/api/chirps')
        .set('Accept', 'application/json')
        .send({ body })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body).toEqual({ error: 'Malformed authorization header' });
    });

    test('Responds with 400 error if chirp is too long', async () => {
      const response = await request(app)
        .post('/api/chirps')
        .set('Authorization', getAuthToken(userIDs[0]))
        .set('Accept', 'application/json')
        .send({ body: 'a'.repeat(141) })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual({ error: 'Chirp is too long. Max length is 140' });
    });
  });

  describe('GET retrieval', () => {
    test('Responds with all chirps', async () => {
      const response = await request(app)
        .get('/api/chirps')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBe(chirpIDs.length);
    });

    test('Responds with all chirps for a specific author', async () => {
      const response = await request(app)
        .get(`/api/chirps?authorId=${userIDs[1]}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.length).toBe(data[1].chirps.length);
    });

    test('Responds with a specific chirp', async () => {
      const chirpId = chirpIDs[2];
      const response = await request(app)
        .get(`/api/chirps/${chirpId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      const { id, body } = response.body;

      expect(id).toBe(chirpId);
      expect(body).toBe(data[0].chirps[2]);
    });

    test('Responds with error for an invalid chirp', async () => {
      const response = await request(app)
        .get('/api/chirps/b7b069e7-d99e-44a4-8a56-8785902ca38f')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({ error: 'Resource not found' });
    });
  });

  describe('DELETE deletion', () => {
    test('Deletes the chirp for a specific id', async () => {
      const chirpId = chirpIDs[2];

      await request(app)
        .delete(`/api/chirps/${chirpId}`)
        .set('Authorization', getAuthToken(userIDs[0]))
        .expect(204);

      const result = await getChirpById(chirpId);
      expect(result).toBeUndefined();
    });

    test('Responds with error for invalid token', async () => {
      const chirpId = chirpIDs[2];

      const result = await request(app)
        .delete(`/api/chirps/${chirpId}`)
        .expect('Content-Type', /json/)
        .expect(401);
      expect(result.body).toEqual({ error: 'Malformed authorization header' });
    });

    test('Responds with error for invalid chirp owner', async () => {
      const chirpId = chirpIDs[2];

      const result = await request(app)
        .delete(`/api/chirps/${chirpId}`)
        .set('Authorization', getAuthToken(userIDs[1]))
        .expect('Content-Type', /json/)
        .expect(403);

      expect(result.body).toEqual({ error: 'Not authorized' });
    });

    test('Responds with error for invalid chirp ID', async () => {
      const response = await request(app)
        .delete('/api/chirps/b7b069e7-d99e-44a4-8a56-8785902ca38f')
        .set('Authorization', getAuthToken(userIDs[0]))
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({ error: 'Resource not found' });
    });
  });
});
