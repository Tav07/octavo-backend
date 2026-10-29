// Router de auth: acá se aplican los middlewares por ruta.
import { Router, type Request, type Response } from "express";
import { crearControladorAuth, type DependenciasAuthController } from "../controllers/auth.controller";
import { validarCuerpo } from "../middlewares/validar";
import { inicioSesionEsquema, registroEsquema } from "../schemas/authentication";
import type { TokenVerifier } from "../../../domain/ports";

export interface Dependencias extends DependenciasAuthController {
  verificarToken: TokenVerifier;
}

export function crearRouterAuth(deps: Dependencias): Router {
  const controlador = crearControladorAuth(deps);
  const router = Router();

  router.post(
    "/login",
    validarCuerpo(inicioSesionEsquema),
    (req: Request, res: Response, next) => {
      controlador.iniciarSesion(req, res, next).catch(next);
    }
  );

  router.post(
    "/register",
    validarCuerpo(registroEsquema),
    (req: Request, res: Response, next) => {
      controlador.registrar(req, res, next).catch(next);
    }
  );

  return router;
}