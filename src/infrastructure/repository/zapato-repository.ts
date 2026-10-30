// Implementación del repositorio de zapatos con Prisma. Único lugar
// donde se convierte el Decimal de la base al número del dominio.
import type { Prisma, PrismaClient } from "../generated/prisma/client";
import type { RepositorioZapatos, DatosZapato, FiltrosCatalogo } from "../../domain/repositories";
import type { Zapato } from "../../domain/entities";

type ZapatoPrismaConMarca = Prisma.ZapatoGetPayload<{
  include: { marca: { select: { id: true; nombre: true } } };
}>;

function aDominio(encontrado: ZapatoPrismaConMarca): Zapato {
  return {
    id: encontrado.id,
    nombre: encontrado.nombre,
    categoria: encontrado.categoria,
    precio: encontrado.precio.toNumber(),
    talla: encontrado.talla,
    tallas: encontrado.tallas,
    descripcion: encontrado.descripcion,
    imagen: encontrado.imagen,
    marcaId: encontrado.marcaId,
    marca: { id: encontrado.marca.id, nombre: encontrado.marca.nombre },
  };
}

const INCLUIR_MARCA = { marca: { select: { id: true, nombre: true } } } as const;

// where de los filtros del catálogo: marca por id y búsqueda de texto
// (insensible a mayúsculas) en nombre del zapato, descripción y nombre
// de la marca.
function whereDeFiltros(filtros?: FiltrosCatalogo): Prisma.ZapatoWhereInput {
  if (filtros === undefined) return {};
  const texto = filtros.q?.trim();
  if (texto !== undefined && texto !== "" && filtros.marcaId !== undefined) {
    return {
      marcaId: filtros.marcaId,
      OR: [
        { nombre: { contains: texto, mode: "insensitive" } },
        { descripcion: { contains: texto, mode: "insensitive" } },
        { marca: { nombre: { contains: texto, mode: "insensitive" } } },
      ],
    };
  }
  if (texto !== undefined && texto !== "") {
    return {
      OR: [
        { nombre: { contains: texto, mode: "insensitive" } },
        { descripcion: { contains: texto, mode: "insensitive" } },
        { marca: { nombre: { contains: texto, mode: "insensitive" } } },
      ],
    };
  }
  if (filtros.marcaId !== undefined) return { marcaId: filtros.marcaId };
  return {};
}

export class RepositorioZapatosPrisma implements RepositorioZapatos {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(
    pagina: number,
    porPagina: number,
    filtros?: FiltrosCatalogo
  ): Promise<{ datos: Zapato[]; total: number }> {
    const saltar = (pagina - 1) * porPagina;
    const where = whereDeFiltros(filtros);
    // Cuenta y página en una sola ida a la base para que siempre coincidan
    const [encontrados, total] = await this.prisma.$transaction([
      this.prisma.zapato.findMany({
        skip: saltar,
        take: porPagina,
        orderBy: { id: "asc" },
        where,
        include: INCLUIR_MARCA,
      }),
      this.prisma.zapato.count({ where }),
    ]);
    return { datos: encontrados.map(aDominio), total };
  }

  async buscarPorId(id: number): Promise<Zapato | null> {
    const encontrado = await this.prisma.zapato.findUnique({
      where: { id },
      include: INCLUIR_MARCA,
    });
    return encontrado === null ? null : aDominio(encontrado);
  }

  async buscarPorIds(ids: number[]): Promise<Zapato[]> {
    const encontrados = await this.prisma.zapato.findMany({
      where: { id: { in: ids } },
      include: INCLUIR_MARCA,
    });
    return encontrados.map(aDominio);
  }

  async crear(datos: DatosZapato): Promise<Zapato> {
    const creado = await this.prisma.zapato.create({
      data: { ...datos },
      include: INCLUIR_MARCA,
    });
    return aDominio(creado);
  }

  async actualizar(id: number, datos: DatosZapato): Promise<Zapato> {
    const actualizado = await this.prisma.zapato.update({
      where: { id },
      data: { ...datos },
      include: INCLUIR_MARCA,
    });
    return aDominio(actualizado);
  }

  async eliminar(id: number): Promise<void> {
    await this.prisma.zapato.delete({ where: { id } });
  }
}