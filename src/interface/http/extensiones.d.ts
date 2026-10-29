// Tipado de lo que el middleware autenticar deja en la petición.
import type { Credentials } from "../../domain/ports";

declare global {
  namespace Express {
    interface Request {
      usuario?: Credentials;
    }
  }
}

export {};