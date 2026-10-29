// Implementación de los puertos TokenSigner/TokenVerifier con jsonwebtoken.
// La firma usa JWT_SECRET y JWT_EXPIRES_IN desde env (config/env.ts):
// payload del token = { id, role } y nada más.
import jwt, { type SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../../domain/errors";
import type { Credentials, TokenSigner, TokenVerifier } from "../../domain/ports";
import type { Rol } from "../../domain/entities";

export class TokensJwt implements TokenSigner, TokenVerifier {
  constructor(private readonly jwtSecret: string, private readonly jwtExpiraEn: string) {}

  async sign(credentials: Credentials): Promise<string> {
    const opciones: SignOptions = {
      // expiresIn en env es texto libre ("1d", "3600"...): los tipos de
      // jsonwebtoken lo piden como StringValue literal.
      expiresIn: this.jwtExpiraEn as SignOptions["expiresIn"],
    };
    return jwt.sign({ id: credentials.id, role: credentials.role }, this.jwtSecret, opciones);
  }

  verify(token: string): Credentials {
    try {
      const decodificado = jwt.verify(token, this.jwtSecret);
      if (typeof decodificado === "object" && decodificado !== null) {
        const { id, role } = decodificado as Record<string, unknown>;
        if (typeof id === "number" && (role === "admin" || role === "user")) {
          return { id, role: role as Rol };
        }
      }
    } catch {
      // firma inválida o token vencido: jwt.verify lanza y cae aquí
    }
    throw new UnauthorizedError("Token inválido o vencido");
  }
}