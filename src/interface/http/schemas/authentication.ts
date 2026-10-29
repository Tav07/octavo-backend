import { z } from "zod";

// Esquemas zod del módulo auth. Los mensajes son los que verá el usuario
// junto a cada campo en el frontend (fase 8).

export const registroEsquema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 letras.")
    .max(80, "El nombre es muy largo (máximo 80)."),
  email: z.email("Escribe un correo válido (ej: nombre@correo.com)."),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .max(72, "La contraseña es muy larga (máximo 72)."),
});

export const inicioSesionEsquema = z.object({
  email: z.email("Escribe un correo válido (ej: nombre@correo.com)."),
  password: z.string().min(1, "La contraseña es obligatoria."),
});

export type DatosRegistro = z.infer<typeof registroEsquema>;
export type DatosInicioSesion = z.infer<typeof inicioSesionEsquema>;