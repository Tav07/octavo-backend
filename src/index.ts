// Raíz de composición: construye las implementaciones de infrastructure,
// arma los casos de uso de application y enciende el servidor.
// Si falta una variable de entorno requerida, no arranca.
import { prisma } from "./infrastructure/prisma/client";
import { cargarConfiguracion } from "./infrastructure/config/env";
import { HasheadorBcrypt } from "./infrastructure/security/bcrypt-hasher";
import { TokensJwt } from "./infrastructure/security/jwt-tokens";
import { RepositorioUsuariosPrisma } from "./infrastructure/repository/user-repository";
import { RepositorioZapatosPrisma } from "./infrastructure/repository/zapato-repository";
import { RepositorioMarcasPrisma } from "./infrastructure/repository/marca-repository";
import { RepositorioReservasPrisma } from "./infrastructure/repository/reserva-repository";
import { crearCasoRegistrarse } from "./application/auth/register";
import { crearCasoIniciarSesion } from "./application/auth/login";
import { crearCasoListarZapatos } from "./application/zapatos/listar";
import { crearCasoDetalleZapato } from "./application/zapatos/detalle";
import { crearCasoCrearZapato } from "./application/zapatos/crear";
import { crearCasoActualizarZapato } from "./application/zapatos/actualizar";
import { crearCasoEliminarZapato } from "./application/zapatos/eliminar";
import { crearCasoListarMarcas } from "./application/marcas/listar";
import { crearCasoCrearReserva } from "./application/reservas/crear";
import { crearCasoListarMisReservas } from "./application/reservas/listar-mias";
import { crearCasoListarTodasReservas } from "./application/reservas/listar-todas";
import { createApp } from "./interface/http/server";

const config = cargarConfiguracion();

const hasheador = new HasheadorBcrypt();
const tokens = new TokensJwt(config.jwtSecret, config.jwtExpiraEn);
const repositorioUsuarios = new RepositorioUsuariosPrisma(prisma);
const repositorioZapatos = new RepositorioZapatosPrisma(prisma);
const repositorioMarcas = new RepositorioMarcasPrisma(prisma);
const repositorioReservas = new RepositorioReservasPrisma(prisma);

const app = createApp({
  auth: {
    registrarse: crearCasoRegistrarse({ repositorio: repositorioUsuarios, hasheador }),
    iniciarSesion: crearCasoIniciarSesion({
      repositorio: repositorioUsuarios,
      hasheador,
      tokens,
    }),
    verificarToken: tokens,
  },
  zapatos: {
    listar: crearCasoListarZapatos({ repositorio: repositorioZapatos }),
    detalle: crearCasoDetalleZapato({ repositorio: repositorioZapatos }),
    crear: crearCasoCrearZapato({ repositorio: repositorioZapatos }),
    actualizar: crearCasoActualizarZapato({ repositorio: repositorioZapatos }),
    eliminar: crearCasoEliminarZapato({ repositorio: repositorioZapatos }),
    verificarToken: tokens,
  },
  reservas: {
    crear: crearCasoCrearReserva({
      repositorioZapatos: repositorioZapatos,
      repositorio: repositorioReservas,
    }),
    listarMias: crearCasoListarMisReservas({ repositorio: repositorioReservas }),
    listarTodas: crearCasoListarTodasReservas({ repositorio: repositorioReservas }),
    verificarToken: tokens,
  },
  marcas: {
    listar: crearCasoListarMarcas({ repositorio: repositorioMarcas }),
  },
  origenCors: config.frontendUrl,
});

app.listen(config.puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${config.puerto}`);
});