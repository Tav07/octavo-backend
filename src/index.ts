// Raíz de composición: construye las implementaciones de infrastructure,
// arma los casos de uso de application y enciende el servidor.
// Si falta una variable de entorno requerida, no arranca.
import { prisma } from "./infrastructure/prisma/client";
import { cargarConfiguracion } from "./infrastructure/config/env";
import { HasheadorBcrypt } from "./infrastructure/security/bcrypt-hasher";
import { TokensJwt } from "./infrastructure/security/jwt-tokens";
import { RepositorioUsuariosPrisma } from "./infrastructure/repository/user-repository";
import { crearCasoRegistrarse } from "./application/auth/register";
import { crearCasoIniciarSesion } from "./application/auth/login";
import { createApp } from "./interface/http/server";

const config = cargarConfiguracion();

const hasheador = new HasheadorBcrypt();
const tokens = new TokensJwt(config.jwtSecret, config.jwtExpiraEn);
const repositorioUsuarios = new RepositorioUsuariosPrisma(prisma);

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
});

app.listen(config.puerto, () => {
  console.log(`Servidor escuchando en http://localhost:${config.puerto}`);
});