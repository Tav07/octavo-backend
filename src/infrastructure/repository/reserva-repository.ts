// Implementación del repositorio de reservas con Prisma. Incluye el
// zapato reservado y los datos del usuario para las listas.
import type { Prisma, PrismaClient } from "../generated/prisma/client";
import type { RepositorioReservas, DatosReserva } from "../../domain/repositories";
import type { Reserva } from "../../domain/entities";

type ReservaPrismaCompleta = Prisma.ReservaGetPayload<{
  include: {
    zapato: { select: { id: true; nombre: true; imagen: true; precio: true } };
    user: { select: { id: true; nombre: true; email: true } };
  };
}>;

function aDominio(encontrado: ReservaPrismaCompleta): Reserva {
  return {
    id: encontrado.id,
    userId: encontrado.userId,
    telefono: encontrado.telefono,
    talla: encontrado.talla,
    mensaje: encontrado.mensaje,
    createdAt: encontrado.createdAt,
    zapato: {
      id: encontrado.zapato.id,
      nombre: encontrado.zapato.nombre,
      imagen: encontrado.zapato.imagen,
      precio: encontrado.zapato.precio.toNumber(),
    },
    usuario: {
      id: encontrado.user.id,
      nombre: encontrado.user.nombre,
      email: encontrado.user.email,
    },
  };
}

const INCLUIR = {
  zapato: { select: { id: true, nombre: true, imagen: true, precio: true } },
  user: { select: { id: true, nombre: true, email: true } },
} as const;

export class RepositorioReservasPrisma implements RepositorioReservas {
  constructor(private readonly prisma: PrismaClient) {}

  async crear(userId: number, datos: DatosReserva): Promise<Reserva> {
    const creado = await this.prisma.reserva.create({
      data: {
        userId,
        zapatoId: datos.zapatoId,
        telefono: datos.telefono,
        talla: datos.talla,
        mensaje: datos.mensaje,
      },
      include: INCLUIR,
    });
    return aDominio(creado);
  }

  async listarPorUsuario(userId: number): Promise<Reserva[]> {
    const encontradas = await this.prisma.reserva.findMany({
      where: { userId },
      orderBy: { id: "desc" },
      include: INCLUIR,
    });
    return encontradas.map(aDominio);
  }

  async listarTodas(): Promise<Reserva[]> {
    const encontradas = await this.prisma.reserva.findMany({
      orderBy: { id: "desc" },
      include: INCLUIR,
    });
    return encontradas.map(aDominio);
  }
}