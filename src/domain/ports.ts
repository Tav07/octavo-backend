// Puertos: lo que application necesita y infrastructure implementa
// (bcrypt para contraseñas, jsonwebtoken para tokens).

import type { Rol } from "./entities";

// Payload del JWT: solo lo especifica el backend, nunca más.
export interface Credentials {
  id: number;
  role: Rol;
}

export interface PasswordHasher {
  hash(contrasenia: string): Promise<string>;
  verify(contrasenia: string, hash: string): Promise<boolean>;
}

export interface TokenSigner {
  sign(credentials: Credentials): Promise<string>;
}

// El middleware autenticar lo usa por petición.
// Lanza UnauthorizedError si el token no valida (falta, alterado o vencido).
export interface TokenVerifier {
  verify(token: string): Credentials;
}