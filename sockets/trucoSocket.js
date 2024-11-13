import { Server } from 'socket.io'
import SalasContoller from '../controllers/salasController.js';

export default function socket(io) {

    let salasController = new SalasContoller();

    io.on('connection', (socket) => {

      console.log('Nova conexão com o ID:', socket.id);

      let idUsuario = socket.handshake.query.idUsuario;
      let codSala = socket.handshake.query.codSala;
      let nome = socket.handshake.query.nome;

      socket.join(codSala);
      io.to(codSala).emit('entrar', {participante: nome});
      io.to(codSala).emit('entrar', {});

        socket.on('disconnect', async (s) => {
          
          const resultado = await salasController.remover(idUsuario, codSala);
          if (resultado.status === 200) {
              socket.emit('sair', { mensagem: "Você saiu da sala. Redirecionando para salas disponíveis..." });
          } else {
              console.error("Erro ao remover o jogador:", resultado.msg);
          }
      });

      socket.on("teste", (msg) => {
        io.to(msg.codSala).emit("teste", msg);
      })

      socket.on("mensagem", (msg) => {
          io.to(msg.codSala).emit("mensagem", {
              nome: msg.nome,  
              mensagem: msg.mensagem,  
          });
      });
    });
}