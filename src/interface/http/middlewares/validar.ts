// Middleware genérico: valida req.body con un esquema zod.
// Si no valida → 400 con detalle por campo (formato de error único).
// Si valida → deja los datos ya transformados (trim) en req.body.
import type { RequestHandler } from "express";
import type { z } from "zod";
import { ValidationError } from "../../../domain/errors";

export function validarCuerpo(esquema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    const resultado = esquema.safeParse(req.body ?? {});
    if (!resultado.success) {
      const errores: Record<string, string> = {};
      for (const problema of resultado.error.issues) {
        const campo = problema.path.map(String).join(".") || "body";
        if (errores[campo] === undefined) errores[campo] = problema.message;
      }
      next(new ValidationError("Revisa los campos marcados.", errores));
      return;
    }
    req.body = resultado.data;
    next();
  };
}