import express from 'express'
import routerUsuarios from './Routes/usuarioRoute.js';
import routerSalas from './Routes/salasRoutes.js';
import cookieParser from 'cookie-parser'
//import { createRequire } from "module";
import cors from 'cors'

//const require = createRequire(import.meta.url);

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({origin: 'http://localhost:3000', credentials: true}));

app.use("/usuarios", routerUsuarios);
app.use("/salas", routerSalas);

app.listen(5000, function() {
    console.log("servidor web em funcionamento na porta 5000!");
});