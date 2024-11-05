import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routerUsuarios from './Routes/usuarioRoute.js';
import routerSalas from './Routes/salasRoutes.js';
import routerBaralho from './Routes/baralhoRoutes.js'
import socketInit from './sockets/trucoSocket.js';

//import { createRequire } from "module";
//const require = createRequire(import.meta.url);

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
  }
});

const estadoJogo = {
  pontuacao: [0, 0],
  jogadas: [],
};

const jogadores = {}; 

socketInit(io);

io.on('connection', (socket) => {
  console.log('Usuário conectado');

  // Envia o estado inicial do jogo ao novo cliente
  socket.emit('estadoJogo', estadoJogo);

  socket.on('registrarJogador', (nome) => {
      // Registrar o jogador com um nome único
      jogadores[socket.id] = nome;
      console.log(`${nome} se juntou ao jogo.`);
      io.emit('atualizarJogadores', Object.values(jogadores));
  });

  socket.on('jogada', (dados) => {
      console.log('Recebido:', dados);
      // Exemplo de validação simples
      if (!jogadores[socket.id]) {
          socket.emit('erro', 'Você precisa estar registrado para jogar.');
          return;
      }

      estadoJogo.jogadas.push({ jogador: jogadores[socket.id], acao: dados.acao });

      // Atualiza a pontuação (exemplo)
      if (dados.acao === "Pedir Truco") {
          estadoJogo.pontuacao[0] += 1; // Aumenta a pontuação da equipe 1
      }

      // Envia a atualização do estado do jogo para todos os usuários
      io.emit('jogada', {
          jogada: { jogador: jogadores[socket.id], acao: dados.acao },
          pontuacao: estadoJogo.pontuacao
      });
  });

  socket.on('disconnect', () => {
      console.log('Usuário desconectado');
      // Remove o jogador do jogo
      delete jogadores[socket.id];
      io.emit('atualizarJogadores', Object.values(jogadores));
  });
});

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use("/usuarios", routerUsuarios);
app.use("/salas", routerSalas);
app.use("/baralho", routerBaralho);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`BackEnd - Servidor web e WebSocket rodando na porta ${PORT}!`);
  // console.log("BackEnd - Servidor web em funcionamento na porta 5000!");
});
