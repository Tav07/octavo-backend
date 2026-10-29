import express, { Express } from "express";
import healthRouter from "./routes/health.routes";

// Arma la aplicación HTTP: middlewares globales + routers.
// Un servidor por capa: aquí solo se cablea, casi sin lógica.
export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use("/api", healthRouter);

  return app;
}