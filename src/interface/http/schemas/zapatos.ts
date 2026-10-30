import { z } from "zod";

// Esquemas del catálogo. Categorías de la Entrega 1; tallas 20-50 como
// el formulario original.

export const CATEGORIAS = ["running", "casual", "formal"] as const;

// Rango estándar de tallas del catálogo: si el admin no manda tallas
// (frontend antiguo o formulario corto), se usa este rango completo.
export const TALLAS_BASE = [35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

export const zapatoEsquema = z.object({
  nombre: z
    .string()
    .trim()
    .min(3, "El nombre debe tener al menos 3 letras.")
    .max(100, "El nombre es muy largo (máximo 100)."),
  categoria: z
    .enum(CATEGORIAS, "La categoría debe ser running, casual o formal."),
  precio: z.coerce
    .number("El precio debe ser un número.")
    .min(1, "El precio debe ser mayor a 0.")
    .max(99999999, "El precio es demasiado alto."),
  talla: z.coerce
    .number("La talla debe ser un número.")
    .int("La talla debe ser un número entero.")
    .min(20, "La talla debe estar entre 20 y 50.")
    .max(50, "La talla debe estar entre 20 y 50."),
  tallas: z
    .array(
      z.coerce
        .number("Cada talla debe ser un número.")
        .int("Cada talla debe ser un número entero.")
        .min(20, "Las tallas deben estar entre 20 y 50.")
        .max(50, "Las tallas deben estar entre 20 y 50.")
    )
    .max(20, "Se aceptan hasta 20 tallas por zapato.")
    .optional()
    // Sin tallas en el body → rango estándar; nunca un array vacío.
    .transform((valor) => [...new Set(valor ?? TALLAS_BASE)].sort((a, b) => a - b)),
  descripcion: z
    .string()
    .trim()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(300, "La descripción es muy larga (máximo 300)."),
  imagen: z
    .string()
    .trim()
    .min(3, "La imagen es obligatoria (ruta pública, ej.: /images/archivo.jpg).")
    .max(200, "La ruta de la imagen es muy larga."),
  marcaId: z.coerce
    .number("La marca es obligatoria.")
    .int("La marca debe referenciar un id válido.")
    .positive("La marca es obligatoria."),
});

export const idEsquema = z.object({
  id: z.coerce
    .number("El id debe ser un entero positivo.")
    .int("El id debe ser un entero positivo.")
    .positive("El id debe ser un entero positivo."),
});

// GET /api/zapatos?page=&limit=&marcaId=&q=
export const listarEsquema = z.object({
  page: z.coerce
    .number("La página debe ser un número.")
    .int("La página debe ser un entero.")
    .min(1, "La página debe ser 1 o mayor.")
    .default(1),
  limit: z.coerce
    .number("El límite debe ser un número.")
    .int("El límite debe ser un entero.")
    .min(1, "El límite debe ser 1 o mayor.")
    .max(100, "El límite máximo por página es 100.")
    .default(10),
  // Filtros del catálogo (ambos opcionales): marca para las chips y
  // q para la búsqueda por texto.
  marcaId: z.coerce
    .number("La marca debe ser un número.")
    .int("La marca debe referenciar un id válido.")
    .positive("La marca debe referenciar un id válido.")
    .optional(),
  q: z
    .string()
    .trim()
    .max(100, "La búsqueda es muy larga (máximo 100).")
    .optional()
    // q vacío equivale a sin búsqueda.
    .transform((valor) => (valor === undefined || valor === "" ? undefined : valor)),
});

export type DatosZapatoHttp = z.infer<typeof zapatoEsquema>;
export type DatosListado = z.infer<typeof listarEsquema>;