// Seed: carga exactamente los arreglos marcas y zapatos de
// tienda-zapatos/script.js (Entrega 1) y dos usuarios de prueba.
// Idempotente: cada registro se crea o actualiza por su clave única,
// así el seed se puede correr sin borrar datos existentes.
import bcrypt from "bcryptjs";
import { prisma } from "./client";

// ===================== Datos de la Entrega 1 =====================

const marcas = [
  {
    nombre: "Nike",
    descripcion:
      "Marca insignia del running mundial. Modelos ligeros con la amortiguación que usan los atletas profesionales.",
    pais: "Estados Unidos",
  },
  {
    nombre: "Adidas",
    descripcion:
      "El clásico alemán del deporte. Diseños que funcionan igual en la cancha que en la calle.",
    pais: "Alemania",
  },
  {
    nombre: "Puma",
    descripcion:
      "Deportiva con estilo urbano. Comodidad para el día a día con un look juvenil.",
    pais: "Alemania",
  },
  {
    nombre: "New Balance",
    descripcion:
      "Calzado de corredores exigentes. Amortiguación premium y durabilidad comprobada.",
    pais: "Estados Unidos",
  },
  {
    nombre: "Bata",
    descripcion:
      "Zapatos formales de cuero. Elegancia accesible para la oficina y las ocasiones especiales.",
    pais: "Suiza",
  },
  {
    nombre: "North Star",
    descripcion:
      "El clásico colombiano de tenis urbanos. Cuero y suela de goma que aguantan el uso diario.",
    pais: "Colombia",
  },
];

type ZapatoSemilla = {
  nombre: string;
  marca: string;
  categoria: string;
  precio: number;
  talla: number;
  descripcion: string;
  imagen: string;
};

const zapatos: ZapatoSemilla[] = [
  {
    nombre: "Nike Revolution 8",
    marca: "Nike",
    categoria: "running",
    precio: 289900,
    talla: 41,
    descripcion:
      "Ligeros y transpirables, ideales para empezar a correr o para caminatas largas.",
    imagen: "images/nike-revolution-8.jpg",
  },
  {
    nombre: "Nike Air Max SC",
    marca: "Nike",
    categoria: "casual",
    precio: 359900,
    talla: 42,
    descripcion:
      "La cámara de aire clásica de Nike en un diseño versátil para el uso diario.",
    imagen: "images/nike-air-max-sc.jpg",
  },
  {
    nombre: "Adidas Duramo SL2",
    marca: "Adidas",
    categoria: "running",
    precio: 259900,
    talla: 40,
    descripcion:
      "Zapatillas ligeras con mediasuela EVA. Comodidad que aguanta el ritmo.",
    imagen: "images/adidas-duramo-sl2.jpg",
  },
  {
    nombre: "Adidas Grand Court",
    marca: "Adidas",
    categoria: "casual",
    precio: 279900,
    talla: 43,
    descripcion:
      "Estilo tenis retro en cuero sintético. Combinan con absolutamente todo.",
    imagen: "images/adidas-grand-court.jpg",
  },
  {
    nombre: "Adidas Runfalcon 5",
    marca: "Adidas",
    categoria: "running",
    precio: 239900,
    talla: 42,
    descripcion:
      "Amortiguación suave y suela con buen agarre. La favorita del entrenamiento diario.",
    imagen: "images/adidas-runfalcon-5.jpg",
  },
  {
    nombre: "Puma Smash V2",
    marca: "Puma",
    categoria: "casual",
    precio: 249900,
    talla: 41,
    descripcion:
      "Suela de goma clásica y cuero resistente. El modelo que nunca falla.",
    imagen: "images/puma-smash-v2.jpg",
  },
  {
    nombre: "Puma Softride Enzo NXT",
    marca: "Puma",
    categoria: "running",
    precio: 299900,
    talla: 44,
    descripcion:
      "Mediasuela Softride para pisadas suaves. Pensadas para kilómetros largos.",
    imagen: "images/puma-softride-enzo.jpg",
  },
  {
    nombre: "New Balance 5030",
    marca: "New Balance",
    categoria: "running",
    precio: 319900,
    talla: 43,
    descripcion:
      "Malla transpirable y amortiguación ligera. Comodidad para el running y el día a día.",
    imagen: "images/new-balance-5030.jpg",
  },
  {
    nombre: "New Balance 9060",
    marca: "New Balance",
    categoria: "casual",
    precio: 349900,
    talla: 39,
    descripcion:
      "Silueta chunky con estética ochentera. El modelo lifestyle más buscado.",
    imagen: "images/new-balance-9060.jpg",
  },
  {
    nombre: "North Star Court",
    marca: "North Star",
    categoria: "casual",
    precio: 179900,
    talla: 40,
    descripcion:
      "Tenis clásicos de cuero con suela de goma. El básico urbano que combina con todo.",
    imagen: "images/bata-north-star.jpg",
  },
  {
    nombre: "Bata Flex",
    marca: "Bata",
    categoria: "formal",
    precio: 189900,
    talla: 42,
    descripcion:
      "Flexibilidad total y acabado pulido. Elegancia a precio accesible.",
    imagen: "images/bata-flex.jpg",
  },
  {
    nombre: "Puma Rebound Joy",
    marca: "Puma",
    categoria: "casual",
    precio: 269900,
    talla: 38,
    descripcion:
      "Botines deportivos de caña alta, inspirados en el básquetbol clásico.",
    imagen: "images/puma-rebound-joy.jpg",
  },
];

// ===================== Usuarios de prueba =====================

const RONDAS_BCRYPT = 10;

const usuarios = [
  {
    nombre: "Admin de prueba",
    email: "admin@octavo.com",
    contrasena: "admin123",
    role: "admin" as const,
  },
  {
    nombre: "User de prueba",
    email: "user@octavo.com",
    contrasena: "user123",
    role: "user" as const,
  },
];

// ===================== Ejecución =====================

async function main(): Promise<void> {
  // Marcas: por nombre (clave única en la base)
  for (const marca of marcas) {
    await prisma.marca.upsert({
      where: { nombre: marca.nombre },
      update: { descripcion: marca.descripcion, pais: marca.pais },
      create: marca,
    });
  }

  // Mapa nombre de marca -> id, para enlazar los zapatos
  const idDeMarca = new Map(
    (await prisma.marca.findMany()).map((m) => [m.nombre, m.id])
  );

  // Zapatos: la Entrega 1 guardaba "images/...”; la API lo sirve
  // como ruta pública absoluta (/images/...).
  for (const zapato of zapatos) {
    const marcaId = idDeMarca.get(zapato.marca);
    if (marcaId === undefined) {
      throw new Error(`La marca "${zapato.marca}" no existe en la base`);
    }

    const datos = {
      nombre: zapato.nombre,
      categoria: zapato.categoria,
      precio: zapato.precio,
      talla: zapato.talla,
      descripcion: zapato.descripcion,
      imagen: `/${zapato.imagen}`,
      marcaId,
    };

    await prisma.zapato.upsert({
      where: { nombre: zapato.nombre },
      update: datos,
      create: datos,
    });
  }

  // Usuarios de prueba, con la contraseña hasheada (nunca en texto plano)
  for (const usuario of usuarios) {
    const password = await bcrypt.hash(usuario.contrasena, RONDAS_BCRYPT);
    await prisma.user.upsert({
      where: { email: usuario.email },
      update: { nombre: usuario.nombre, password, role: usuario.role },
      create: {
        nombre: usuario.nombre,
        email: usuario.email,
        password,
        role: usuario.role,
      },
    });
  }

  const enLaBase = {
    marcas: await prisma.marca.count(),
    zapatos: await prisma.zapato.count(),
    usuarios: await prisma.user.count(),
  };
  console.log(
    `Seed completado: ${enLaBase.marcas} marcas, ${enLaBase.zapatos} zapatos, ${enLaBase.usuarios} usuarios.`
  );
}

main()
  .catch((error) => {
    console.error("Error al correr el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });