// Interfaces de repositorios: los casos de uso dependen de esto,
// de las implementaciones de infrastructure (Prisma) ni de oídas.

import type { Marca, Usuario, Zapato, Reserva, Pedido } from "./entities";

// Filtros del catálogo: marca y búsqueda por texto (GET /api/zapatos
// ?marcaId=&q=). Ambos opcionales.
export interface FiltrosCatalogo {
  marcaId?: number;
  q?: string;
}

export interface RepositorioUsuarios {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  // Siempre crea usuario común: el admin ya existe por seed; solo se
  // puede asignar admin desde la base misma.
  crear(datos: { nombre: string; email: string; password: string }): Promise<Usuario>;
}

export interface DatosZapato {
  nombre: string;
  categoria: string;
  precio: number;
  talla: number;
  tallas: number[];
  descripcion: string;
  imagen: string;
  marcaId: number;
}

export interface RepositorioZapatos {
  // Si el registro no existe, Prisma lanza (P2025) y el middleware lo
  // traduce a 404; el repositorio no lo silencia.
  listar(
    pagina: number,
    porPagina: number,
    filtros?: FiltrosCatalogo
  ): Promise<{ datos: Zapato[]; total: number }>;
  buscarPorId(id: number): Promise<Zapato | null>;
  // Para validar un carrito completo (caso de uso de pedidos) en una
  // sola consulta; el orden del resultado no corresponde al de entrada.
  buscarPorIds(ids: number[]): Promise<Zapato[]>;
  crear(datos: DatosZapato): Promise<Zapato>;
  actualizar(id: number, datos: DatosZapato): Promise<Zapato>;
  eliminar(id: number): Promise<void>;
}

export interface RepositorioMarcas {
  listar(): Promise<Marca[]>;
}

// Datos que el usuario envía al reservar: el userId sale del token,
// nunca del body (lo agrega el caso de uso).
export interface DatosReserva {
  zapatoId: number;
  telefono: string;
  talla: number;
  mensaje: string | null;
}

export interface RepositorioReservas {
  crear(userId: number, datos: DatosReserva): Promise<Reserva>;
  listarPorUsuario(userId: number): Promise<Reserva[]>;
  listarTodas(): Promise<Reserva[]>;
}

// ===================== Pedidos =====================

// Un ítem ya validado y con precio congelado: el caso de uso lo arma
// después de verificar tallas y de calcular totales con los precios
// de la base; el repositorio solo lo persiste.
export interface DatosItemPedido {
  zapatoId: number;
  talla: number;
  precioUnitario: number;
}

// Datos listos para guardar: el total ya fue calculado por el backend.
export interface DatosPedido {
  total: number;
  direccion: string;
  telefono: string;
  nota: string | null;
  items: DatosItemPedido[];
}

export interface RepositorioPedidos {
  crear(userId: number, datos: DatosPedido): Promise<Pedido>;
  listarPorUsuario(userId: number): Promise<Pedido[]>;
  listarTodas(): Promise<Pedido[]>;
}