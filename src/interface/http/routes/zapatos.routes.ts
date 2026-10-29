// Router del catálogo. GET y GET/:id públicos; POST/PUT/DELETE con
// autenticar + soloAdmin aplicados acá (en el router, no en controllers).
import { Router, type Request, type Response } from "express";
import { crearControladorZapatos, type DependenciasZapatosController } from "../controllers/zapatos.controller";
import { validarCuerpo, validarConsulta, validarParametros } from "../middlewares/validar";
import { autenticar, soloAdmin } from "../middlewares/authenticate";
import { zapatoEsquema, idEsquema, listarEsquema } from "../schemas/zapatos";
import type { TokenVerifier } from "../../../domain/ports";
import type { RequestHandler } from "express";

export interface DependenciasZapatos extends DependenciasZapatosController {
  verificarToken: TokenVerifier;
}

export function crearRouterZapatos(deps: DependenciasZapatos): Router {
  const controlador = crearControladorZapatos(deps);
  const autenticado: RequestHandler = autenticar(deps.verificarToken);

  const router = Router();

  // Público: catálogo y detalle
  router.get(
    "/",
    validarConsulta(listarEsquema),
    (req: Request, res: Response, next) => {
      controlador.listar(req, res, next).catch(next);
    }
  );
  router.get(
    "/:id",
    validarParametros(idEsquema),
    (req: Request, res: Response, next) => {
      controlador.detalle(req, res, next).catch(next);
    }
  );

  // Solo admin: CRUD
  router.post(
    "/",
    autenticado,
    soloAdmin,
    validarCuerpo(zapatoEsquema),
    (req: Request, res: Response, next) => {
      controlador.crear(req, res, next).catch(next);
    }
  );
  router.put(
    "/:id",
    autenticado,
    soloAdmin,
    validarParametros(idEsquema),
    validarCuerpo(zapatoEsquema),
    (req: Request, res: Response, next) => {
      controlador.actualizar(req, res, next).catch(next);
    }
  );
  router.delete(
    "/:id",
    autenticado,
    soloAdmin,
    validarParametros(idEsquema),
    (req: Request, res: Response, next) => {
      controlador.eliminar(req, res, next).catch(next);
    }
  );

  return router;
}