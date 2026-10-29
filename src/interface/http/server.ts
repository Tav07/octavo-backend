// Arma la aplicación HTTP: middlewares globales + routers + manejo de errores.
// Recibe los servicios ya construidos (el cableado vive en index.ts,
// la raíz de composición); aquí solo se conectan.
import express, { Express } from "express";
import healthRouter from "./routes/health.routes";
import { crearRouterAuth, type Dependencias } from "./routes/auth.routes";
import { manejarErrores } from "./middlewares/errors";

interface CasosAuth {
  auth: Dependencias;
}

export function createApp(deps: CasosAuth): Express {
  const app = express();

  app.use(express.json());
  app.use("/api", healthRouter);
  app.use("/api/auth", crearRouterAuth(deps.auth));
  app.use(manejarErrores);

  return app;
}