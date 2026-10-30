import { z } from "zod";

// Esquemas de pedidos: el usuario envía su carrito (zapatos y tallas
// elegidas) y los datos de entrega; los montos los calcula el backend
// y el userId sale del token, nunca del body.

const REGEX_TELEFONO = /^[0-9+\s()-]{7,15}$/;

export const itemCarritoEsquema = z.object({
  zapatoId: z.coerce
    .number("Selecciona un zapato del catálogo.")
    .int("Selecciona un zapato del catálogo.")
    .positive("Selecciona un zapato del catálogo."),
  talla: z.coerce
    .number("La talla debe ser un número.")
    .int("La talla debe ser un número entero.")
    .min(20, "La talla debe estar entre 20 y 50.")
    .max(50, "La talla debe estar entre 20 y 50."),
});

export const crearPedidoEsquema = z.object({
  items: z
    .array(itemCarritoEsquema)
    .min(1, "El carrito está vacío: agrega al menos un zapato.")
    .max(50, "El carrito no acepta más de 50 ítems."),
  direccion: z
    .string()
    .trim()
    .min(10, "La dirección debe tener al menos 10 caracteres.")
    .max(200, "La dirección es muy larga (máximo 200)."),
  telefono: z
    .string()
    .trim()
    .regex(REGEX_TELEFONO, "El teléfono debe tener entre 7 y 15 dígitos."),
  nota: z
    .string()
    .trim()
    .max(300, "La nota es muy larga (máximo 300).")
    .optional()
    // "" y ausente significan lo mismo: null
    .transform((valor) => (valor === undefined || valor === "" ? null : valor)),
});

export type DatosPedidoHttp = z.infer<typeof crearPedidoEsquema>;