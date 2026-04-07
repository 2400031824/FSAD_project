import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";

let appPromise: Promise<express.Express> | null = null;

async function createApiApp() {
  const app = express();
  app.set("trust proxy", 1);

  const httpServer = createServer(app);
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
}

export default async function handler(req: any, res: any) {
  appPromise ||= createApiApp();
  const app = await appPromise;
  return app(req, res);
}
