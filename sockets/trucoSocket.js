import { Server } from 'socket.io'
import SalasContoller from '../controllers/salasController.js';

export default function socket(io) {

    let salasController = new SalasContoller();
    io.on('connection', (socket) => {
      let codSala = socket.handshake.query.codSala;
      let nome = socket.handshake.query.nome;
      socket.join(codSala);
      io.to(codSala).emit('entrar', {participante: nome});
      socket.on('disconnect', () => {   
          //quando houver reload na página onde o cliente está iniciado, esse evento é disparado e o usuário é removido. Para que no inicio de carregamento ele seja inserido novamente.
          salasController.remover(nome, codSala);
          io.to(codSala).emit('sair', {saiu: true, qtde: socket.rooms.size, participante: nome});
        });
  
      socket.on('enviarMensagem', (msg) => {
        io.to(msg.codSala).emit('enviarMensagem', msg);
      });

      socket.on("teste", (msg) => {
        io.to(msg.codSala).emit("teste", msg);
      })
    });
}