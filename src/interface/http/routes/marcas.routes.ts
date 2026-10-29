// Router de marcas: GET /api/marcas público (filtros y formulario admin).
import { Router, type Request, type Response } from "express";
import { crearControladorMarcas, type DependenciasMarcasController } from "../controllers/marcas.controller";

export function crearRouterMarcas(deps: DependenciasMarcasController): Router {
  const controlador = crearControladorMarcas(deps);
  const router = Router();

  router.get("/", (req: Request, res: Response, next) => {
    controlador.listar(req, res, next).catch(next);
  });

  return router;
}