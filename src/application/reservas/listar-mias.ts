// Caso de uso: las reservas del usuario de la sesión (GET /api/reservas/mias).
import type { RepositorioReservas } from "../../domain/repositories";

export interface DependenciasListarMisReservas {
  repositorio: RepositorioReservas;
}

export function crearCasoListarMisReservas(deps: DependenciasListarMisReservas) {
  return async (userId: number) => {
    return await deps.repositorio.listarPorUsuario(userId);
  };
}

export type CasoListarMisReservas = ReturnType<typeof crearCasoListarMisReservas>;