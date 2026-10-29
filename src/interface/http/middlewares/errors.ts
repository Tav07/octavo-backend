// Middleware central de errores, al final de la cadena.
// Traduce los errores de dominio a { message, errors? } con su status,
// y nunca delata stack traces ni detalles internos.
import type { NextFunction, Request, Response } from "express";
import { ErrorDominio } from "../../../domain/errors";

export function manejarErrores(
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error instanceof ErrorDominio) {
    res.status(error.statusCode).json({
      message: error.message,
      ...(error.errors !== undefined ? { errors: error.errors } : {}),
    });
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