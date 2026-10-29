// Implementación del repositorio de usuarios con Prisma.
// Único lugar (junto al client) donde aparece el modelo "User".
import type { User, PrismaClient } from "../generated/prisma/client";
import type { RepositorioUsuarios } from "../../domain/repositories";
import type { Usuario } from "../../domain/entities";

// Traduce el modelo Prisma a la entidad del dominio (mismos campos aquí).
function aDominio(encontrado: User): Usuario {
  return {
    id: encontrado.id,
    nombre: encontrado.nombre,
    email: encontrado.email,
    password: encontrado.password,
    role: encontrado.role,
    createdAt: encontrado.createdAt,
  };
}

export class RepositorioUsuariosPrisma implements RepositorioUsuarios {
  constructor(private readonly prisma: PrismaClient) {}

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const encontrado = await this.prisma.user.findUnique({ where: { email } });
    return encontrado === null ? null : aDominio(encontrado);
  }

  async crear(datos: { nombre: string; email: string; password: string }): Promise<Usuario> {
    const creado = await this.prisma.user.create({
      data: { nombre: datos.nombre, email: datos.email, password: datos.password, role: "user" },
    });
    return aDominio(creado);
  }
}