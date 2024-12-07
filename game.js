import ParticipanteRepository from "./repositories/participanteRepository.js";
import { obterCartas } from "./utils/baralhoUtils.js";


export default class Game {
   
    state = {
        jogadores: {},
        maos: [],
        rodadas: {},
        movimentacoes: {},
        vira: {}
    };


    observers = [];
    subscribe(observerFunction) {
        this.observers.push(observerFunction)
    }


    notifyAll(command) {
        for (const observerFunction of this.observers) {
            observerFunction(command)
        }
    }


    get quantidadeJogadores() { return Object.keys(this.state.jogadores).length; }


    constructor() {
    }


    async AdicionarJogador(command) {
        const { socketId, id, nome, sal_id, eqp_id } = command;


        const participanteRepository = new ParticipanteRepository();
        const par_id = await participanteRepository.adicionarParticipante(sal_id, id, eqp_id);


        this.state.jogadores[socketId] = {
            id,
            nome,
            sal_id,
            eqp_id,
            par_id
        }


        this.notifyAll({
            type: 'add-player',
            jogador: this.state.jogadores[socketId]
        });
    }


    async RemoverJogador(socketId) {
        const jogador = this.state.jogadores[socketId];


        const participanteRepository = new ParticipanteRepository();
        await participanteRepository.removerParticipante(jogador.sal_id, jogador.id);


        delete this.state.jogadores[socketId];


        this.notifyAll({
            type: 'player-disconnected',
            jogador
        });
    }


    async AdicionarMao(command) {
        const { sal_id } = command;
        const cartas = await obterCartas();
        const vira = cartas.shift();


        const mao = {
            sal_id,
            trucada: 'N',
            valor: 1,
            cartas,
            vira
        };
        this.state.maos.push(mao);


        const cartasPorJogador = 3; // Número de cartas que cada jogador recebe
        const jogadoresComCartas = Object.values(this.state.jogadores).map((jogador, index) => {
            const inicio = index * cartasPorJogador; // Índice inicial para o slice
            const cartasDoJogador = cartas.slice(inicio, inicio + cartasPorJogador); // Pega 3 cartas
            return {
                ...jogador,
                cartas: cartasDoJogador,
            };
        });


        this.state.jogadores = jogadoresComCartas;


        this.notifyAll({
            type: 'nova-mao',
            jogadores: this.state.jogadores,
            mao
        })
    }
}
