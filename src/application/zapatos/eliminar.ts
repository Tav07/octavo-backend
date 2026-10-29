// Caso de uso: eliminar un zapato (DELETE /api/zapatos/:id, solo admin).
import type { RepositorioZapatos } from "../../domain/repositories";

// Si el id no existe → P2025 → 404. Si tiene reservas → P2003 → 409.
export type CasoEliminarZapato = (id: number) => Promise<void>;

export function crearCasoEliminarZapato(deps: { repositorio: RepositorioZapatos }): CasoEliminarZapato {
  return async (id) => {
    await deps.repositorio.eliminar(id);
  };
}