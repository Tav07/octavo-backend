// Caso de uso: listar marcas (GET /api/marcas), para filtros y para
// el formulario del admin.
import type { Marca } from "../../domain/entities";
import type { RepositorioMarcas } from "../../domain/repositories";

export type CasoListarMarcas = () => Promise<Marca[]>;

export function crearCasoListarMarcas(deps: { repositorio: RepositorioMarcas }): CasoListarMarcas {
  return () => deps.repositorio.listar();
}