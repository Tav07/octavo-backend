// Caso de uso: listar el catálogo pagado con filtros opcionales
// (GET /api/zapatos?page=&limit=&marcaId=&q=).
import type { Zapato } from "../../domain/entities";
import type { RepositorioZapatos, FiltrosCatalogo } from "../../domain/repositories";

// Formato de respuesta del backend para listados paginados.
export interface CatalogoPaginado {
  pagination: { page: number; limit: number; total: number; totalPages: number };
  data: Zapato[];
}

export type CasoListarZapatos = (
  pagina: number,
  porPagina: number,
  filtros?: FiltrosCatalogo
) => Promise<CatalogoPaginado>;

export function crearCasoListarZapatos(deps: { repositorio: RepositorioZapatos }): CasoListarZapatos {
  return async (pagina, porPagina, filtros) => {
    const { datos, total } = await deps.repositorio.listar(pagina, porPagina, filtros);
    return {
      pagination: {
        page: pagina,
        limit: porPagina,
        total,
        totalPages: Math.max(1, Math.ceil(total / porPagina)),
      },
      data: datos,
    };
  };
}