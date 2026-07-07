import express, { type Request, type Response } from 'express';

const app = express();
const PORT = 8080;

function handlerReadiness(req: Request, res: Response): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');
}

app.use('/app', express.static('./src/app'));

app.get('/healthz', handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
