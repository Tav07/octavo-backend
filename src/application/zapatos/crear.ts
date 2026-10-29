// Caso de uso: crear un zapato (POST /api/zapatos, solo admin).
import type { Zapato } from "../../domain/entities";
import type { DatosZapato, RepositorioZapatos } from "../../domain/repositories";

// Si la marca no existe o el nombre ya está en uso, Prisma lanza
// (P2003 / P2002) y el middleware de errores lo traduce (409).
export type CasoCrearZapato = (datos: DatosZapato) => Promise<Zapato>;

export function crearCasoCrearZapato(deps: { repositorio: RepositorioZapatos }): CasoCrearZapato {
  return async (datos) => deps.repositorio.crear(datos);
}