import request from 'supertest';
import app from 'src/app.js';
import config from 'src/config.js';
import { deleteUsers } from '../../src/db/queries/users.js';

vi.mock(import('../../src/db/queries/users.js'), () => {
  return {
    deleteUsers: vi.fn().mockResolvedValue(null),
  };
});

const defaultPlatform = config.api.platform;
const metricsCount = 17;

afterEach(() => {
  config.api.fileServerHits = 0;
  config.api.platform = defaultPlatform;
  vi.restoreAllMocks();
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
    config.api.fileServerHits = metricsCount;

    const response = await request(app)
      .post('/admin/reset')
      .expect('Content-Type', /text/)
      .expect(200);

    expect(response.text).toBe('Hits reset to 0');
    expect(deleteUsers).toHaveBeenCalledOnce();
    expect(config.api.fileServerHits).toBe(0);
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
