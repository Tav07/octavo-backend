// Única salida de la capa infrastructure: el resto del backend usa
// repositorios (que se implementarán aquí) en lugar del cliente directo.
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 no lee .env solo: la cadena de conexión llega por entorno.
// Sin DATABASE_URL la app no debe arrancar (falla pronto y con mensaje claro).
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    "DATABASE_URL no está definida: crea .env a partir de .env.example y pon la cadena de PostgreSQL (Neon)."
  );
}

// El adapter de PostgreSQL reemplaza al motor nativo de Prisma 7.
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });