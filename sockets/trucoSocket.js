import { Server } from 'socket.io'
import SalasContoller from '../controllers/salasController.js';

export default function socket(io) {

    let salasController = new SalasContoller();
    io.on('connection', (socket) => {
      console.log('Nova conexão com o ID:', socket.id);
      let codSala = socket.handshake.query.codSala;
      // let nome = socket.handshake.query.nome;
      console.log('socket.handshake.query:', socket.handshake.query);
      socket.join(codSala);
      // io.to(codSala).emit('entrar', {participante: nome});
      io.to(codSala).emit('entrar', {});

      socket.on('disconnect', () => {   
          //quando houver reload na página onde o cliente está iniciado, esse evento é disparado e o usuário é removido. Para que no inicio de carregamento ele seja inserido novamente.
          
          // salasController.remover(socket.id, codSala);
          // io.to(codSala).emit('sair', {saiu: true, qtde: socket.rooms.size, participante: nome});
          
          io.to(codSala).emit('sair', {saiu: true, qtde: socket.rooms.size});
        });
  
      socket.on("teste", (msg) => {
        io.to(msg.codSala).emit("teste", msg);
      })
    });
}