// Configuración de Prisma 7 (reemplaza a las opciones del package.json).
// Prisma ya no carga .env de forma automática: dotenv lo hace aquí y en el
// arranque de la app (ver scripts de package.json).
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/infrastructure/prisma/schema.prisma",
  migrations: {
    path: "src/infrastructure/prisma/migrations",
    // En Prisma 7 el seed vive dentro de migrations
    seed: "tsx src/infrastructure/prisma/seed.ts",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});