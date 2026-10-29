// Caso de uso: actualizar un zapato (PUT /api/zapatos/:id, solo admin).
import type { Zapato } from "../../domain/entities";
import type { DatosZapato, RepositorioZapatos } from "../../domain/repositories";

// Si el id no existe, Prisma lanza P2025 y el middleware lo traduce a 404.
export type CasoActualizarZapato = (id: number, datos: DatosZapato) => Promise<Zapato>;

export function crearCasoActualizarZapato(deps: {
  repositorio: RepositorioZapatos;
}): CasoActualizarZapato {
  return async (id, datos) => deps.repositorio.actualizar(id, datos);
}