import request from 'supertest';
import app from 'src/app.js';

describe('/api/health', () => {
  test('Responds with 200 OK plain text', async () => {
    await request(app)
      .get('/api/health')
      .expect('Content-Type', /text/)
      .expect(200)
      .expect('OK');
  });
});
