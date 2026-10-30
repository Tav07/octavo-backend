// Caso de uso: listar los pedidos del usuario autenticado (GET /api/pedidos/mias).
import type { RepositorioPedidos } from "../../domain/repositories";
import type { Pedido } from "../../domain/entities";

export type CasoListarMisPedidos = (userId: number) => Promise<Pedido[]>;

export function crearCasoListarMisPedidos(deps: {
  repositorio: RepositorioPedidos;
}): CasoListarMisPedidos {
  return async (userId) => {
    return await deps.repositorio.listarPorUsuario(userId);
  };
}