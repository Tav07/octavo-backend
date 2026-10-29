// Caso de uso: TODAS las reservas (GET /api/reservas, solo admin).
import type { RepositorioReservas } from "../../domain/repositories";

export interface DependenciasListarTodasReservas {
  repositorio: RepositorioReservas;
}

export function crearCasoListarTodasReservas(deps: DependenciasListarTodasReservas) {
  return async () => {
    return await deps.repositorio.listarTodas();
  };
}

export type CasoListarTodasReservas = ReturnType<typeof crearCasoListarTodasReservas>;