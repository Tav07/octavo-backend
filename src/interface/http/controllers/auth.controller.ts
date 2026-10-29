// Controllers de auth: reciben la petición (con el body ya validado por
// zod), llaman al caso de uso y responden. Sin lógica de negocio acá.
import type { NextFunction, Request, Response } from "express";
import type { CasoIniciarSesion } from "../../../application/auth/login";
import type { CasoRegistrarse } from "../../../application/auth/register";
import type { DatosInicioSesion, DatosRegistro } from "../schemas/authentication";

export interface DependenciasAuthController {
  registrarse: CasoRegistrarse;
  iniciarSesion: CasoIniciarSesion;
}

export function crearControladorAuth(deps: DependenciasAuthController) {
  return {
    async registrar(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { nombre, email, password } = req.body as DatosRegistro;
        // 201 con el usuario público: nunca se devuelve el password
        res.status(201).json(await deps.registrarse({ nombre, email, password }));
      } catch (error) {
        next(error);
      }
    },

    async iniciarSesion(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { email, password } = req.body as DatosInicioSesion;
        res.json(await deps.iniciarSesion({ email, password }));
      } catch (error) {
        next(error);
      }
    },
  };
}