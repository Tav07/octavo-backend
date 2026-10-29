// Interfaces de repositorios: los casos de uso dependen de esto,
// de las implementaciones de infrastructure (Prisma) ni de oídas.

import type { Marca, Usuario, Zapato, Reserva } from "./entities";

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
  descripcion: string;
  imagen: string;
  marcaId: number;
}

export interface RepositorioZapatos {
  // Si el registro no existe, Prisma lanza (P2025) y el middleware lo
  // traduce a 404; el repositorio no lo silencia.
  listar(pagina: number, porPagina: number): Promise<{ datos: Zapato[]; total: number }>;
  buscarPorId(id: number): Promise<Zapato | null>;
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