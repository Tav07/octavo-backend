// Router de pedidos: POST y "/mias" autenticados; GET "/" solo admin.
// autenticar y soloAdmin se aplican acá, en el router.
import { Router, type Request, type Response, type RequestHandler } from "express";
import { crearControladorPedidos, type DependenciasPedidosController } from "../controllers/pedidos.controller";
import { validarCuerpo } from "../middlewares/validar";
import { autenticar, soloAdmin } from "../middlewares/authenticate";
import { crearPedidoEsquema } from "../schemas/pedidos";
import type { TokenVerifier } from "../../../domain/ports";

export interface DependenciasPedidos extends DependenciasPedidosController {
  verificarToken: TokenVerifier;
}

export function crearRouterPedidos(deps: DependenciasPedidos): Router {
  const controlador = crearControladorPedidos(deps);
  const autenticado: RequestHandler = autenticar(deps.verificarToken);

  const router = Router();

  // "/mias" antes de "/" con match exacto, sin colisión entre sí.
  router.post(
    "/",
    autenticado,
    validarCuerpo(crearPedidoEsquema),
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