// Interfaces de repositorios: los casos de uso dependen de esto,
// de las implementaciones de infrastructure (Prisma) ni de oídas.

import type { Usuario } from "./entities";

export interface RepositorioUsuarios {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  // Siempre crea usuario común: el admin ya existe por seed; solo se
  // puede asignar admin desde la base misma.
  crear(datos: { nombre: string; email: string; password: string }): Promise<Usuario>;
}