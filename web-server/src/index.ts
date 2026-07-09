import express, { type NextFunction, type Request, type Response } from 'express';

const app = express();
const PORT = 8080;

function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
    }
  });

  next();
}

function handlerReadiness(req: Request, res: Response): void {
  res.set('Content-Type', 'text/plain; charset=utf-8');
  res.send('OK');
}

app.use(middlewareLogResponses);
app.use('/app', express.static('./src/app'));

app.get('/healthz', handlerReadiness);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
