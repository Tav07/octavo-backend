// Caso de uso: iniciar sesión (POST /api/auth/login) → JWT + usuario público.
import { UnauthorizedError } from "../../domain/errors";
import { usuarioAPublico } from "../../domain/entities";
import type { TokenSigner } from "../../domain/ports";
import type { PasswordHasher } from "../../domain/ports";
import type { RepositorioUsuarios } from "../../domain/repositories";
import type { UsuarioPublico } from "../../domain/entities";

export type CasoIniciarSesion = (datos: {
  email: string;
  password: string;
}) => Promise<{ token: string; usuario: UsuarioPublico }>;

export function crearCasoIniciarSesion(deps: {
  repositorio: RepositorioUsuarios;
  hasheador: PasswordHasher;
  tokens: TokenSigner;
}): CasoIniciarSesion {
  return async (datos) => {
    const usuario = await deps.repositorio.buscarPorEmail(datos.email);
    const contraseniaValida =
      usuario !== null && (await deps.hasheador.verify(datos.password, usuario.password));

    if (usuario === null || !contraseniaValida) {
      // Mensaje genérico a propósito: no se revela si falló el email o la contraseña
      throw new UnauthorizedError("Credenciales inválidas");
    }

    // Payload del token: solo { id, role }
    const token = await deps.tokens.sign({ id: usuario.id, role: usuario.role });
    return { token, usuario: usuarioAPublico(usuario) };
  };
}