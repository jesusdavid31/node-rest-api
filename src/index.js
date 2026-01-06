import express from "express";
import usersRoutes from "./routes/users.routes.js";
import morgan from "morgan";
import { PORT } from "./config.js";

const app = express();

// middleware para registrar las peticiones HTTP por consola
app.use(morgan("dev"));

// middleware para interpretar datos JSON
app.use(express.json());
// Esto es para que el servidor pueda interpretar datos enviados desde formularios HTML
app.use(express.urlencoded({ extended: false }));

app.use(usersRoutes);

app.listen(PORT, () => {
    console.log('Server is running on port', PORT);
});