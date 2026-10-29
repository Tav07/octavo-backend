// Caso de uso: detalle de un zapato (GET /api/zapatos/:id).
import { NotFoundError } from "../../domain/errors";
import type { Zapato } from "../../domain/entities";
import type { RepositorioZapatos } from "../../domain/repositories";

export type CasoDetalleZapato = (id: number) => Promise<Zapato>;

export function crearCasoDetalleZapato(deps: { repositorio: RepositorioZapatos }): CasoDetalleZapato {
  return async (id) => {
    const zapato = await deps.repositorio.buscarPorId(id);
    if (zapato === null) {
      throw new NotFoundError("Zapato no encontrado");
    }
    return zapato;
  };
}