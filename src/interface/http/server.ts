// Arma la aplicación HTTP: middlewares globales + routers + manejo de errores.
// Recibe los servicios ya construidos (el cableado vive en index.ts,
// la raíz de composición); aquí solo se conectan.
import express, { Express } from "express";
import cors from "cors";
import healthRouter from "./routes/health.routes";
import { crearRouterAuth, type Dependencias } from "./routes/auth.routes";
import { crearRouterZapatos, type DependenciasZapatos } from "./routes/zapatos.routes";
import { crearRouterReservas, type DependenciasReservas } from "./routes/reservas.routes";
import {
  crearRouterMarcas,
} from "./routes/marcas.routes";
import type { DependenciasMarcasController } from "./controllers/marcas.controller";
import { manejarErrores } from "./middlewares/errors";

export interface DependenciasServidor {
  auth: Dependencias;
  zapatos: DependenciasZapatos;
  reservas: DependenciasReservas;
  marcas: DependenciasMarcasController;
  // Origen permitido (FRONTEND_URL); nunca "*" para no abrir la API a cualquiera
  origenCors: string;
}

export function createApp(deps: DependenciasServidor): Express {
  const app = express();

  app.use(cors({ origin: deps.origenCors }));
  app.use(express.json());
  app.use("/api", healthRouter);
  app.use("/api/auth", crearRouterAuth(deps.auth));
  app.use("/api/zapatos", crearRouterZapatos(deps.zapatos));
  app.use("/api/reservas", crearRouterReservas(deps.reservas));
  app.use("/api/marcas", crearRouterMarcas(deps.marcas));
  app.use(manejarErrores);

  return app;
}