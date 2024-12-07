import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import socketInit from './sockets/trucoSocket.js';
import swaggerUi from 'swagger-ui-express'
import { createRequire } from "module";



import routerUsuarios from './Routes/usuarioRoute.js';
import routerSalas from './Routes/salasRoutes.js';
import routerBaralho from './Routes/baralhoRoutes.js';
import participanteRoutes from './Routes/participanteRoutes.js';
import equipeRoutes from './Routes/equipeRoutes.js';
import jogoRoutes from './Routes/jogoRoutes.js'
import maoRoutes from './Routes/maoRoutes.js';
import rodadaRoutes from './Routes/rodadaRoutes.js';
import cartaRoutes from './Routes/cartaRoutes.js';

const require = createRequire(import.meta.url);
const outputJson = require("./swagger-output.json");

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const socketList = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
  }
});

// const estadoJogo = {
//   pontuacao: [0, 0],
//   jogadas: [],
// };

// const jogadores = {}; 

// socketInit(io);

// io.on('connection', (socket) => {
//   const idUsuario = socket.handshake.query.idUsuario;
//   const codSala = socket.handshake.query.codSala;
//   const nome = socket.handshake.query.nome;

//   if (!idUsuario || !codSala || !nome) {
//     console.error("Server: Parâmetros de conexão faltando:", { idUsuario, codSala, nome });
//   }

//   socket.emit('estadoJogo', estadoJogo);

//   socket.on('registrarJogador', (nome) => {
//       jogadores[socket.id] = nome;
//       io.emit('atualizarJogadores', Object.values(jogadores));
//   });

//   socket.on('jogada', (dados) => {
//       if (!jogadores[socket.id]) {
//           socket.emit('erro', 'Você precisa estar registrado para jogar.');
//           return;
//       }

//       estadoJogo.jogadas.push({ jogador: jogadores[socket.id], acao: dados.acao });

//       if (dados.acao === "Pedir Truco") {
//           estadoJogo.pontuacao[0] += 1; 
//       }

//       io.emit('jogada', {
//           jogada: { jogador: jogadores[socket.id], acao: dados.acao },
//           pontuacao: estadoJogo.pontuacao
//       });
//   });

//   socket.on('disconnect', () => {
//     delete jogadores[socket.id];
    
//     io.emit('atualizarJogadores', Object.values(jogadores));

//     socket.emit('sair', { mensagem: "Você saiu da sala. Redirecionando para salas disponíveis..." });
//   });
// });

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(outputJson))
app.use("/usuarios", routerUsuarios);
app.use("/salas", routerSalas);
app.use("/baralho", routerBaralho);
app.use('/participantes', participanteRoutes);
app.use('/equipe', equipeRoutes);
app.use('/jogo', jogoRoutes);
app.use('/mao', maoRoutes);
app.use('/rodada', rodadaRoutes);
app.use('/carta', cartaRoutes);

await socketInit(socketList);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`BackEnd - Servidor web e WebSocket rodando na porta ${PORT}!`);
});
