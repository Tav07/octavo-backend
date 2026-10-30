// Implementación del repositorio de pedidos con Prisma. Crea el pedido
// y sus ítems en una transacción; incluye el usuario y el zapato de
// cada ítem para las listas.
import type { Prisma, PrismaClient } from "../generated/prisma/client";
import type { RepositorioPedidos, DatosPedido } from "../../domain/repositories";
import type { Pedido } from "../../domain/entities";

type PedidoPrismaCompleto = Prisma.PedidoGetPayload<{
  include: {
    user: { select: { id: true; nombre: true; email: true } };
    items: { include: { zapato: { select: { id: true; nombre: true; imagen: true; precio: true } } } };
  };
}>;

function aDominio(encontrado: PedidoPrismaCompleto): Pedido {
  return {
    id: encontrado.id,
    userId: encontrado.userId,
    estado: encontrado.estado,
    total: encontrado.total.toNumber(),
    direccion: encontrado.direccion,
    telefono: encontrado.telefono,
    nota: encontrado.nota,
    createdAt: encontrado.createdAt,
    items: encontrado.items.map((item) => ({
      id: item.id,
      zapatoId: item.zapatoId,
      zapato: {
        id: item.zapato.id,
        nombre: item.zapato.nombre,
        imagen: item.zapato.imagen,
        precio: item.zapato.precio.toNumber(),
      },
      talla: item.talla,
      precioUnitario: item.precioUnitario.toNumber(),
    })),
    usuario: {
      id: encontrado.user.id,
      nombre: encontrado.user.nombre,
      email: encontrado.user.email,
    },
  };
}

const INCLUIR = {
  user: { select: { id: true, nombre: true, email: true } },
  items: { include: { zapato: { select: { id: true, nombre: true, imagen: true, precio: true } } } },
} as const;

export class RepositorioPedidosPrisma implements RepositorioPedidos {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(userId: number, datos: DatosPedido): Promise<Pedido> {
    const creado = await this.prisma.pedido.create({
      // Pago contra entrega: todo pedido nace pendiente de pago.
      data: {
        userId,
        estado: "PENDIENTE" as const,
        total: datos.total,
        direccion: datos.direccion,
        telefono: datos.telefono,
        nota: datos.nota,
        items: {
          create: datos.items.map((item) => ({
            zapatoId: item.zapatoId,
            talla: item.talla,
            precioUnitario: item.precioUnitario,
          })),
        },
      },
      include: INCLUIR,
    });
    return aDominio(creado);
  }

  async listarPorUsuario(userId: number): Promise<Pedido[]> {
    const encontrados = await this.prisma.pedido.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: INCLUIR,
    });
    return encontrados.map(aDominio);
  }

  async listarTodas(): Promise<Pedido[]> {
    const encontrados = await this.prisma.pedido.findMany({
      orderBy: { id: "desc" },
      include: INCLUIR,
    });
    return encontrados.map(aDominio);
  }
}