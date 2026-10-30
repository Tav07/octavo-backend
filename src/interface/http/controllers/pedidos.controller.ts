// Controllers de pedidos: reciben la petición, llaman al caso de uso y
// responden. El userId sale de req.usuario (lo deja el middleware
// autenticar); NUNCA del body.
import type { NextFunction, Request, Response } from "express";
import type { CasoCrearPedido } from "../../../application/pedidos/crear";
import type { CasoListarMisPedidos } from "../../../application/pedidos/listar-mias";
import type { CasoListarTodosPedidos } from "../../../application/pedidos/listar-todas";
import type { DatosPedidoHttp } from "../schemas/pedidos";
import type { Credentials } from "../../../domain/ports";

export interface DependenciasPedidosController {
  crear: CasoCrearPedido;
  listarMias: CasoListarMisPedidos;
  listarTodas: CasoListarTodosPedidos;
}

export function crearControladorPedidos(deps: DependenciasPedidosController) {
  return {
    async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        // El autenticar garantiza req.usuario, pero TypeScript pide el guard
        const credenciales = req.usuario as Credentials;
        const { items, direccion, telefono, nota } = req.body as DatosPedidoHttp;
        const pedido = await deps.crear(credenciales.id, { items, direccion, telefono, nota });
        res.status(201).json(pedido);
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