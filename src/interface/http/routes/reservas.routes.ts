// Router de reservas: POST y "/mias" autenticados; GET "/" solo admin.
// autenticar y soloAdmin se aplican acá, en el router.
import { Router, type Request, type Response, type RequestHandler } from "express";
import { crearControladorReservas, type DependenciasReservasController } from "../controllers/reservas.controller";
import { validarCuerpo } from "../middlewares/validar";
import { autenticar, soloAdmin } from "../middlewares/authenticate";
import { crearReservaEsquema } from "../schemas/reservas";
import type { TokenVerifier } from "../../../domain/ports";

export interface DependenciasReservas extends DependenciasReservasController {
  verificarToken: TokenVerifier;
}

export function crearRouterReservas(deps: DependenciasReservas): Router {
  const controlador = crearControladorReservas(deps);
  const autenticado: RequestHandler = autenticar(deps.verificarToken);

  const router = Router();

  // "/mias" y "/" son rutas con match exacto, sin colisión entre sí.
  router.post(
    "/",
    autenticado,
    validarCuerpo(crearReservaEsquema),
    (req: Request, res: Response, next) => {
      controlador.crear(req, res, next).catch(next);
    }
  );
  router.get(
    "/mias",
    autenticado,
    (req: Request, res: Response, next) => {
      controlador.mias(req, res, next).catch(next);
    }
  );
  router.get(
    "/",
    autenticado,
    soloAdmin,
    (req: Request, res: Response, next) => {
      controlador.todas(req, res, next).catch(next);
    }
  );

  return router;
}