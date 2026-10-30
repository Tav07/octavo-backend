// Caso de uso: listar todos los pedidos de la tienda (GET /api/pedidos, solo admin).
import type { RepositorioPedidos } from "../../domain/repositories";
import type { Pedido } from "../../domain/entities";

export type CasoListarTodosPedidos = () => Promise<Pedido[]>;

export function crearCasoListarTodosPedidos(deps: {
  repositorio: RepositorioPedidos;
}): CasoListarTodosPedidos {
  return async () => {
    return await deps.repositorio.listarTodas();
  };
}