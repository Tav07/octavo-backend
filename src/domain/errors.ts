// Errores de dominio: los casos de uso los lanzan y el middleware de
// errores de interface los traduce a respuestas HTTP. El formato de
// error del backend es { message: string, errors?: Record<string, string> }.

export class ErrorDominio extends Error {
  readonly statusCode: number;
  readonly errors?: Record<string, string>;

  constructor(statusCode: number, message: string, errors?: Record<string, string>) {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

// 400: validación de entrada (zod responde así vía este error).
export class ValidationError extends ErrorDominio {
  constructor(message = "Datos inválidos", errors?: Record<string, string>) {
    super(400, message, errors);
  }
}

// 401: sin sesión, token inválido/expirado o credenciales incorrectas.
// Mensaje genérico en login para no revelar qué falló.
export class UnauthorizedError extends ErrorDominio {
  constructor(message = "Credenciales inválidas") {
    super(401, message);
  }
}

// 403: sesión válida pero sin permiso.
export class ForbiddenError extends ErrorDominio {
  constructor(message = "No tienes permiso para esta acción") {
    super(403, message);
  }
}

// 404: recurso inexistente.
export class NotFoundError extends ErrorDominio {
  constructor(message = "Recurso no encontrado") {
    super(404, message);
  }
}

// 409: conflicto de estado (email ya registrado, FK violada, ...).
export class ConflictError extends ErrorDominio {
  constructor(message = "Conflicto con el estado actual del recurso", errors?: Record<string, string>) {
    super(409, message, errors);
  }
}