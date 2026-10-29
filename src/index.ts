import { createApp } from "./interface/http/server";

// Render define PORT por su cuenta; en desarrollo cae al 3000.
const port = Number(process.env.PORT) || 3000;

const app = createApp();

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});