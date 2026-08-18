import request from 'supertest';
import { testDB } from './lib/test-db.js';
import { db } from 'src/db/index.js';
import app from 'src/app.js';
import config from 'src/config.js';
import { createUserRecord } from './lib/helpers.js';
import { getAllUsers, deleteUsers } from 'src/db/queries/users.js';

vi.mock(import('../../src/db/index.js'), () => ({
  db: testDB as unknown as typeof db,
}));

const defaultPlatform = config.api.platform;
const metricsCount = 17;

afterEach(async () => {
  config.api.fileServerHits = 0;
  config.api.platform = defaultPlatform;
  await deleteUsers();
});

describe('/admin/metrics', () => {
  test('Responds with metrics count html page', async () => {
    config.api.fileServerHits = metricsCount;

    const response = await request(app)
      .get('/admin/metrics')
      .expect('Content-Type', /html/)
      .expect(200);

    expect(response.text).toMatch(new RegExp(`visited ${metricsCount + 1} times`));
    expect(response.text).toMatchInlineSnapshot(`
      "<html>
            <body>
              <h1>Welcome, Chirpy Admin</h1>
              <p>Chirpy has been visited 18 times!</p>
            </body>
          </html>"
    `);
  });
});

describe('/admin/reset', () => {
  test('Deletes all users from the DB and resets the metrics count', async () => {
    const users = [
      { email: 'james.t.kirk@starfleet.com', password: 'enterprise' },
      { email: 'spock@starfleet.com', password: 'logical' },
      { email: 'leonard.mccoy@starfleet.com', password: 'bones' },
    ];

    for (const user of users) {
      await createUserRecord(user);
    }

    let records = await getAllUsers();
    expect(records.length).toBe(users.length);

    config.api.fileServerHits = metricsCount;

    const response = await request(app)
      .post('/admin/reset')
      .expect('Content-Type', /text/)
      .expect(200);

    expect(response.text).toBe('Hits reset to 0');
    expect(config.api.fileServerHits).toBe(0);

    records = await getAllUsers();
    expect(records.length).toBe(0);
  });

  test('Responds with 403 error when the platform is not dev', async () => {
    config.api.platform = 'production';

    await request(app)
      .post('/admin/reset')
      .expect('Content-Type', /json/)
      .expect({ error: 'Reset is only allowed in dev environment' })
      .expect(403);
  });
});
