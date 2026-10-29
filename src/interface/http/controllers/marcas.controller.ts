// Controller de marcas (GET /api/marcas): público, para filtros del
// catálogo y para el formulario del admin.
import type { NextFunction, Request, Response } from "express";
import type { CasoListarMarcas } from "../../../application/marcas/listar";

export interface DependenciasMarcasController {
  listar: CasoListarMarcas;
}

export function crearControladorMarcas(deps: DependenciasMarcasController) {
  return {
    async listar(_req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json(await deps.listar());
      } catch (error) {
        next(error);
      }
    },
  };
}