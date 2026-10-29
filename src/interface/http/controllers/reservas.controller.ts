// Controllers de reservas: reciben la petición, llaman al caso de uso y
// responden. El userId sale de req.usuario (lo deja el middleware
// autenticar); NUNCA del body.
import type { NextFunction, Request, Response } from "express";
import type { CasoCrearReserva } from "../../../application/reservas/crear";
import type { CasoListarMisReservas } from "../../../application/reservas/listar-mias";
import type { CasoListarTodasReservas } from "../../../application/reservas/listar-todas";
import type { DatosReservaHttp } from "../schemas/reservas";
import type { Credentials } from "../../../domain/ports";

export interface DependenciasReservasController {
  crear: CasoCrearReserva;
  listarMias: CasoListarMisReservas;
  listarTodas: CasoListarTodasReservas;
}

export function crearControladorReservas(deps: DependenciasReservasController) {
  return {
    async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        // El autenticar garantiza req.usuario, pero TypeScript pide el guard
        const credenciales = req.usuario as Credentials;
        const { zapatoId, telefono, talla, mensaje } = req.body as DatosReservaHttp;
        const reserva = await deps.crear(credenciales.id, {
          zapatoId,
          telefono,
          talla,
          mensaje,
        });
        res.status(201).json(reserva);
      } catch (error) {
        next(error);
      }
    },

    async mias(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const credenciales = req.usuario as Credentials;
        res.json(await deps.listarMias(credenciales.id));
      } catch (error) {
        next(error);
      }
    },

    async todas(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        res.json(await deps.listarTodas());
      } catch (error) {
        next(error);
      }
    },
  };
}