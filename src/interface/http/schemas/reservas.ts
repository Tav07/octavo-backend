import { z } from "zod";

// Esquemas de reservas. Solo viajan los campos del formulario original
// que siguen teniendo sentido; nombre/email salen del usuario autenticado.

const REGEX_TELEFONO = /^[0-9+\s()-]{7,15}$/;

export const crearReservaEsquema = z.object({
  zapatoId: z.coerce
    .number("Selecciona un zapato del catálogo.")
    .int("Selecciona un zapato del catálogo.")
    .positive("Selecciona un zapato del catálogo."),
  telefono: z
    .string()
    .trim()
    .regex(REGEX_TELEFONO, "El teléfono debe tener entre 7 y 15 dígitos."),
  talla: z.coerce
    .number("La talla debe ser un número.")
    .int("La talla debe ser un número entero.")
    .min(20, "La talla debe estar entre 20 y 50.")
    .max(50, "La talla debe estar entre 20 y 50."),
  mensaje: z
    .string()
    .trim()
    .max(300, "El mensaje es muy largo (máximo 300).")
    .optional()
    // "" y ausente significan lo mismo: null
    .transform((valor) => (valor === undefined || valor === "" ? null : valor)),
});

export type DatosReservaHttp = z.infer<typeof crearReservaEsquema>;