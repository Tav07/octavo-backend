// Caso de uso: crear un pedido desde el carrito (POST /api/pedidos).
// El userId sale del token y los precios/talla los valida el backend:
// el frontend manda solo zapatoId + talla, nunca montos.
import type { RepositorioPedidos, RepositorioZapatos, DatosPedido } from "../../domain/repositories";
import type { Pedido } from "../../domain/entities";
import { NotFoundError, ValidationError } from "../../domain/errors";

export interface DependenciasCrearPedido {
  repositorioZapatos: RepositorioZapatos;
  repositorio: RepositorioPedidos;
}

export type ItemDeCarrito = { zapatoId: number; talla: number };

export type CasoCrearPedido = (
  userId: number,
  datos: {
    items: ItemDeCarrito[];
    direccion: string;
    telefono: string;
    nota: string | null;
  }
) => Promise<Pedido>;

export function crearCasoCrearPedido(deps: DependenciasCrearPedido): CasoCrearPedido {
  return async (userId, datos) => {
    // Los pares (zapato, talla) únicos del carrito: dos tallas del mismo
    // zapato son ítems distintos; el mismo par repetido se fusiona.
    const solicitados = new Map<string, ItemDeCarrito>();
    for (const item of datos.items) {
      solicitados.set(`${item.zapatoId}-${item.talla}`, item);
    }

    const zapatos = await deps.repositorioZapatos.buscarPorIds(
      [...solicitados.values()].map((item) => item.zapatoId)
    );
    const porId = new Map(zapatos.map((zapato) => [zapato.id, zapato]));

    // Un zapato del carrito que ya no existe → 404 (con su id).
    const errores: Record<string, string> = {};
    for (const item of solicitados.values()) {
      const zapato = porId.get(item.zapatoId);
      if (zapato === undefined) {
        throw new NotFoundError(`Zapato no encontrado (id ${item.zapatoId})`);
      }
      if (!zapato.tallas.includes(item.talla)) {
        errores[`items.${zapato.nombre}.talla`] =
          `Talla no disponible para ${zapato.nombre} (disponibles: ${zapato.tallas.join(", ")}).`;
      }
    }

    if (Object.keys(errores).length > 0) {
      throw new ValidationError("Revisa las tallas de tu carrito.", errores);
    }

    // Montos: recalculados acá con los precios de la base.
    const itemsListos = [...solicitados.values()].map((item) => ({
      zapatoId: item.zapatoId,
      talla: item.talla,
      precioUnitario: (porId.get(item.zapatoId) as { precio: number }).precio,
    }));
    const totalListo = itemsListos.reduce(
      (acumulado, item) => acumulado + item.precioUnitario,
      0
    );

    const pedido: DatosPedido = {
      total: totalListo,
      direccion: datos.direccion,
      telefono: datos.telefono,
      nota: datos.nota,
      items: itemsListos,
    };

    return await deps.repositorio.crear(userId, pedido);
  };
}