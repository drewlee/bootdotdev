import request from 'supertest';
import app from 'src/app.js';

describe('/', () => {
  test('Responds with the index.html file content', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);

    expect(response.text).toMatchInlineSnapshot(`
      "<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1.0" />
          <title>Chirpy</title>
        </head>
        <body>
          <h1>Welcome to Chirpy</h1>
          <img src="/assets/logo.png" alt="Chirpy logo" />
        </body>
      </html>
      "
    `);
  });

  test('Responds with static assets', async () => {
    await request(app)
      .get('/assets/logo.png')
      .expect('Content-Type', /image/)
      .expect(200);
  });
});
