// Configuración desde variables de entorno. Si falta una requerida,
// la aplicación no arranca (falla rápido y con mensaje claro).

export interface Configuracion {
  jwtSecret: string;
  jwtExpiraEn: string;
  frontendUrl: string; // CORS (se activa en la fase de reservas)
  puerto: number;
}

const REQUERIDAS = ["DATABASE_URL", "JWT_SECRET", "JWT_EXPIRES_IN"] as const;

export function cargarConfiguracion(): Configuracion {
  const faltantes = REQUERIDAS.filter((nombre) => (process.env[nombre] ?? "").trim() === "");
  if (faltantes.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${faltantes.join(", ")}. Copia .env.example y configúralas.`
    );
  }

  return {
    jwtSecret: process.env["JWT_SECRET"] as string,
    jwtExpiraEn: process.env["JWT_EXPIRES_IN"] as string,
    frontendUrl: process.env["FRONTEND_URL"] ?? "",
    puerto: Number(process.env["PORT"]) || 3000,
  };
}