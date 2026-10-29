// Caso de uso: crear una reserva. El userId SIEMPRE sale del token
// (el middleware autenticar lo dejó en req.usuario); el body no lo manda.
import type { RepositorioReservas, RepositorioZapatos, DatosReserva } from "../../domain/repositories";
import type { Reserva } from "../../domain/entities";
import { NotFoundError } from "../../domain/errors";

export interface DependenciasCrearReserva {
  repositorioZapatos: RepositorioZapatos;
  repositorio: RepositorioReservas;
}

export function crearCasoCrearReserva(deps: DependenciasCrearReserva) {
  return async (userId: number, datos: DatosReserva): Promise<Reserva> => {
    // Reservar un zapato que no existe → 404 antes de tocar la tabla.
    const zapato = await deps.repositorioZapatos.buscarPorId(datos.zapatoId);
    if (zapato === null) {
      throw new NotFoundError("Zapato no encontrado");
    }
    return await deps.repositorio.crear(userId, datos);
  };
}

export type CasoCrearReserva = ReturnType<typeof crearCasoCrearReserva>;