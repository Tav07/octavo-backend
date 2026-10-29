// Traduce los errores conocidos del cliente Prisma a errores de dominio.
// Vive en infrastructure (aquí es donde se conoce Prisma); el middleware
// de errores de interface lo invoca y así responde HTTP apropiado.
//  - P2002: violación de unique        → 409
//  - P2025: registro no encontrado     → 404
//  - P2003: FK violada                 → 409 (datos relacionados)
import { ConflictError, NotFoundError, ErrorDominio } from "../../domain/errors";

// Duck-typing del error del cliente Prisma: trae { code, message, meta }.
// Así no acoplamos este módulo a los tipos internos del runtime.
interface ErrorPrisma {
  code: string;
  message: string;
}

function codigoPrisma(error: unknown): error is ErrorPrisma {
  return (
    error instanceof Error &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string"
  );
}

export function traducirError(error: unknown): ErrorDominio | null {
  if (!codigoPrisma(error)) return null;

  switch (error.code) {
    case "P2002":
      return new ConflictError("Ya existe un registro con esos datos únicos.");
    case "P2025":
      return new NotFoundError("Recurso no encontrado");
    case "P2003":
      return new ConflictError(
        "No se puede completar: hay datos relacionados (ej.: reservas asociadas) o referencias inexistentes (ej.: marca)."
      );
    default:
      return null;
  }
}