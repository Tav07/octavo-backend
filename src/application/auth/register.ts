// Caso de uso: registrar un nuevo usuario (POST /api/auth/register).
import { ConflictError } from "../../domain/errors";
import type { PasswordHasher } from "../../domain/ports";
import type { RepositorioUsuarios } from "../../domain/repositories";
import {
  usuarioAPublico,
  type UsuarioPublico,
} from "../../domain/entities";

export interface DatosRegistro {
  nombre: string;
  email: string;
  password: string;
}

export type CasoRegistrarse = (datos: DatosRegistro) => Promise<UsuarioPublico>;

export function crearCasoRegistrarse(deps: {
  repositorio: RepositorioUsuarios;
  hasheador: PasswordHasher;
}): CasoRegistrarse {
  return async (datos) => {
    const existente = await deps.repositorio.buscarPorEmail(datos.email);
    if (existente !== null) {
      throw new ConflictError("Ese email ya está registrado", {
        email: "Ese email ya está registrado",
      });
    }

    // bcrypt: la contraseña nunca se guarda ni viaja en texto plano
    const password = await deps.hasheador.hash(datos.password);

    const usuario = await deps.repositorio.crear({
      nombre: datos.nombre,
      email: datos.email,
      password,
    });
    return usuarioAPublico(usuario);
  };
}