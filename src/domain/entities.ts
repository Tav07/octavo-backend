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