// Middlewares de validación zod para body, params y query.
// Si no valida → 400 con detalle por campo (formato de error único).
// Si valida → deja en la petición los datos ya transformados (coercion/trim).
import type { RequestHandler } from "express";
import type { z } from "zod";
import { ValidationError } from "../../../domain/errors";

function erroresPorCampo(ze: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const problema of ze.issues) {
    const campo = problema.path.map(String).join(".") || "body";
    if (errores[campo] === undefined) errores[campo] = problema.message;
  }
  return errores;
}

// Nota: en Express 5, req.query es de solo lectura (solo getter), así que
// el query validado se guarda en req.consulta; body y params sí se pueden
// reasignar directamente.
function validarYGuardar(
  esquema: z.ZodType,
  origen: "body" | "params"
): RequestHandler {
  return (req, _res, next) => {
    const resultado = esquema.safeParse(req[origen] ?? {});
    if (!resultado.success) {
      next(new ValidationError("Revisa los campos marcados.", erroresPorCampo(resultado.error)));
      return;
    }
    req[origen] = resultado.data;
    next();
  };
}

export const validarCuerpo = (esquema: z.ZodType): RequestHandler =>
  validarYGuardar(esquema, "body");

export const validarParametros = (esquema: z.ZodType): RequestHandler =>
  validarYGuardar(esquema, "params");

export function validarConsulta(esquema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const resultado = esquema.safeParse(req.query ?? {});
    if (!resultado.success) {
      next(new ValidationError("Revisa los campos marcados.", erroresPorCampo(resultado.error)));
      return;
    }
    req.consulta = resultado.data as Record<string, unknown>;
    next();
  };
}