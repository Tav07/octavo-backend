// Implementación del repositorio de marcas con Prisma.
import type { PrismaClient } from "../generated/prisma/client";
import type { RepositorioMarcas } from "../../domain/repositories";
import type { Marca } from "../../domain/entities";

export class RepositorioMarcasPrisma implements RepositorioMarcas {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(): Promise<Marca[]> {
    const marcas = await this.prisma.marca.findMany({ orderBy: { id: "asc" } });
    return marcas.map((marca) => ({
      id: marca.id,
      nombre: marca.nombre,
      descripcion: marca.descripcion,
      pais: marca.pais,
    }));
  }
}