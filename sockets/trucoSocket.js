import Game from '../game.js';

export default async function socket(socketList) {
   
  const game = new Game();

  game.subscribe((command) => {
    console.log(`> Emitindo o evento ${command.type}`)
    socketList.emit(command.type, command)
  });
   
  socketList.on('connection', (socket) => {

    console.log(`Jogador ao server conectado: ${socket.id}`);

    socket.emit('setup', game.state);

    socket.on('disconnect', async () => {
      await game.RemoverJogador(socket.id);
      console.log(game.state);
    });

    socket.on('add-player', async (command) => {    
      await game.AdicionarJogador({...command, socketId: socket.id});
      console.log(game.state);
    });

    socket.on('nova-mao', async (command) => {    
      await game.AdicionarMao(command);
      //game.AdicionarMao({ sal_id: command.sal_id });
      console.log(game.state);
    });

    socket.on('jogada', async(command) => {    
      await game.JogarCarta({...command, socketId: socket.id});
      console.log(game.state);
    });

    socket.on('encerrar-rodada', async (command) => {    
      await game.EncerrarRodada(command);
      console.log(game.state);
    });

    socket.on('encerrar-mao', async ()  => {    
      await game.EncerrarMao();
      console.log(game.state);
    });


  });
}
