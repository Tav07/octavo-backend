// Implementación del puerto PasswordHasher con bcrypt (bcryptjs).
import bcrypt from "bcryptjs";
import type { PasswordHasher } from "../../domain/ports";

const RONDAS = 10;

export class HasheadorBcrypt implements PasswordHasher {
  async hash(contrasenia: string): Promise<string> {
    return bcrypt.hash(contrasenia, RONDAS);
  }

  async verify(contrasenia: string, hash: string): Promise<boolean> {
    return bcrypt.compare(contrasenia, hash);
  }
}