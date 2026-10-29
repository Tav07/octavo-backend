// Entidades del dominio: tipos puros, sin Prisma.

export type Rol = "admin" | "user";

// Contraseña solo como hash; los casos de uso nunca guardan texto plano.
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  role: Rol;
  createdAt: Date;
}

// Versión del usuario apta para respuestas HTTP: nunca incluye password.
export interface UsuarioPublico {
  id: number;
  nombre: string;
  email: string;
  role: Rol;
  createdAt: Date;
}

// Mapper explícito (y no destructuring): así el password solo puede
// saltar a la respuesta por error de este archivo.
export function usuarioAPublico(usuario: Usuario): UsuarioPublico {
  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    role: usuario.role,
    createdAt: usuario.createdAt,
  };
}

// ===================== Catálogo (Entrega 1) =====================

// Referencia a la marca incluida en cada zapato (id + nombre bastan).
export interface ReferenciaMarca {
  id: number;
  nombre: string;
}

// El precio es number en el dominio: infrastructure convierte
// el Decimal de la base (ver zapato-repository).
export interface Zapato {
  id: number;
  nombre: string;
  categoria: string; // running | casual | formal
  precio: number;
  talla: number;
  descripcion: string;
  imagen: string;
  marcaId: number;
  marca: ReferenciaMarca;
}

export interface Marca {
  id: number;
  nombre: string;
  descripcion: string;
  pais: string;
}