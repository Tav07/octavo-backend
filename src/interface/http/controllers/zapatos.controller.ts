// Controllers del catálogo: reciben la petición (body/params/query ya
// validados), llaman al caso de uso y responden. Sin lógica de negocio.
import type { NextFunction, Request, Response } from "express";
import type { CasoListarZapatos } from "../../../application/zapatos/listar";
import type { CasoDetalleZapato } from "../../../application/zapatos/detalle";
import type { CasoCrearZapato } from "../../../application/zapatos/crear";
import type { CasoActualizarZapato } from "../../../application/zapatos/actualizar";
import type { CasoEliminarZapato } from "../../../application/zapatos/eliminar";
import type { DatosListado, DatosZapatoHttp } from "../schemas/zapatos";

export interface DependenciasZapatosController {
  listar: CasoListarZapatos;
  detalle: CasoDetalleZapato;
  crear: CasoCrearZapato;
  actualizar: CasoActualizarZapato;
  eliminar: CasoEliminarZapato;
}

export function crearControladorZapatos(deps: DependenciasZapatosController) {
  return {
    async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const consulta = req.consulta as DatosListado;
        res.json(
          await deps.listar(consulta.page, consulta.limit, {
            marcaId: consulta.marcaId,
            q: consulta.q,
          })
        );
      } catch (error) {
        next(error);
      }
    },

    async detalle(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id } = req.params as unknown as { id: number };
        res.json(await deps.detalle(id));
      } catch (error) {
        next(error);
      }
    },

    async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        // 201 con el zapato creado y su marca incluida
        res.status(201).json(await deps.crear(req.body as DatosZapatoHttp));
      } catch (error) {
        next(error);
      }
    },

    async actualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id } = req.params as unknown as { id: number };
        res.json(await deps.actualizar(id, req.body as DatosZapatoHttp));
      } catch (error) {
        next(error);
      }
    },

    async eliminar(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id } = req.params as unknown as { id: number };
        await deps.eliminar(id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}