import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routerUsuarios from './Routes/usuarioRoute.js';
import routerSalas from './Routes/salasRoutes.js';
import socketInit from './sockets/TrucoSocket.js';

//import { createRequire } from "module";


//const require = createRequire(import.meta.url);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  });

socketInit(io);

app.use(express.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

app.use(cors({origin: 'http://localhost:3000', credentials: true}));

app.use("/usuarios", routerUsuarios);
app.use("/salas", routerSalas);

app.listen(5000, function() {
    console.log("servidor web em funcionamento na porta 5000!");
});