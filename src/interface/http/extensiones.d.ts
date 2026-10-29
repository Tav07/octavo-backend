// Tipado de lo que el middleware autenticar deja en la petición.
import type { Credentials } from "../../domain/ports";

declare global {
  namespace Express {
    interface Request {
      usuario?: Credentials;
      /** Query ya validado y coercionado por validarConsulta (req.query es de solo lectura en Express 5). */
      consulta?: Record<string, unknown>;
    }
  }
}

export {};