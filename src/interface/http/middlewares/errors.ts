// Middleware central de errores, al final de la cadena.
// Traduce los errores de dominio a { message, errors? } con su status,
// y nunca delata stack traces ni detalles internos.
import type { NextFunction, Request, Response } from "express";
import { ErrorDominio } from "../../../domain/errors";
import { traducirError } from "../../../infrastructure/prisma/errors";

export function manejarErrores(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // 1) Errores de dominio (los casos de uso y middlewares los lanzan)
  if (error instanceof ErrorDominio) {
    responderDominio(error.statusCode, error.message, error.errors, res);
    return;
  }

  // 2) Errores de Prisma traducidos (P2002 → 409, P2025 → 404, P2003 → 409)
  const errorPrisma = traducirError(error);
  if (errorPrisma !== null) {
    responderDominio(errorPrisma.statusCode, errorPrisma.message, errorPrisma.errors, res);
    return;
  }

  // Cuerpo JSON malformado: express 5 lanza SyntaxError con propiedad body
  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({ message: "El cuerpo de la petición no es JSON válido." });
    return;
  }

  if (res.headersSent) {
    next(error);
    return;
  }

  // Error no controlado: se loguea para el operador y se responde genérico
  console.error("Error interno:", error);
  res.status(500).json({ message: "Error interno del servidor." });
}

function responderDominio(
  statusCode: number,
  message: string,
  errors?: Record<string, string>,
  res?: Response
): void {
  if (res === undefined) return;
  res.status(statusCode).json({
    message,
    ...(errors !== undefined ? { errors } : {}),
  });
}