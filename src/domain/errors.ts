// Errores de dominio: los servicios de application los lanzan y
// el middleware de errores de interface los traduce a respuestas HTTP.

export class NotFoundError extends Error {
  readonly statusCode = 404;

  constructor(message = "Recurso no encontrado") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error {
  readonly statusCode = 409;

  constructor(message = "Conflicto con el estado actual del recurso") {
    super(message);
    this.name = "ConflictError";
  }
}