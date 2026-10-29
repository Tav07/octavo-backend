// Middlewares de autenticación y rol. Se aplican en los routers,
// nunca se copian en controllers.
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../../domain/errors";
import type { Credentials, TokenVerifier } from "../../../domain/ports";

// Lee "Authorization: Bearer <token>", verifica la firma y deja
// req.usuario = { id, role } para los handlers de la ruta.
// Sin token → 401. Token inválido/expirado → 401.
export function autenticar(verificarToken: TokenVerifier): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const cabecera = req.headers.authorization;
    const token = typeof cabecera === "string" ? cabecera.replace(/^Bearer\s+/i, "").trim() : "";

    if (token === "") {
      next(new UnauthorizedError("Debes iniciar sesión para esta acción."));
      return;
    }

    let credenciales: Credentials;
    try {
      credenciales = verificarToken.verify(token);
    } catch {
      next(new UnauthorizedError("Token inválido o vencido."));
      return;
    }

    req.usuario = credenciales;
    next();
  };
}

// Después de autenticar: sesión válida pero sin rol admin → 403.
export const soloAdmin: RequestHandler = (req, _res, next): void => {
  if (req.usuario?.role !== "admin") {
    next(new ForbiddenError("Esta acción requiere ser administrador."));
    return;
  }
  next();
};