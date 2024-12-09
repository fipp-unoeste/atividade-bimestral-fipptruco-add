import ParticipanteRepository from "./repositories/participanteRepository.js";
import { obterCartas, obterMovimencacaoVencedora, obterTotalPontosPorEquipe, distribuirCartasParaJogadores } from "./utils/baralhoUtils.js";
import MaoRepository from "./repositories/maoRepository.js";
import JogoRepository from "./repositories/jogoRepository.js";
import CartaRepository from "./repositories/cartaRepository.js";
import RodadaRepository from "./repositories/rodadaReposytory.js";
import MaoEntity from "./entities/maoEntity.js";
import JogoEntity from "./entities/jogoEntity.js";

export default class Game {
    
    state = {
        jogadores: {},
        maos: []
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
            //par_id: Math.floor(Math.random() * 1000000)
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
        const { sal_id, maoAnterior } = command;
        const cartas = await obterCartas();
        const vira = cartas.shift();

        const mao = {
            id: Math.floor(Math.random() * 1000000),
            //id: maoId,
            sal_id,
            trucada: 'N',
            valor: 1,
            vira
        };

        const jogadoresComCartas = distribuirCartasParaJogadores(cartas, this.state.jogadores);

        this.state.jogadores = jogadoresComCartas;
        this.state.maoAtual = {...mao, rodadas: [], movimentacoes: []};

        this.notifyAll({
            type: 'nova-mao',
            jogadores: this.state.jogadores,
            mao,
            maoAnterior
        })
    }

    JogarCarta(command) {
        const { socketId, carta } = command;
        let equipeVencedoraId = null;
        let rodadaEncerrada = false;
        
        const movimentacao = {
            id: Math.floor(Math.random() * 1000000),
            tipo: 'jogada',
            jogador: this.state.jogadores[socketId],
            carta
        };

        this.state.jogadores[socketId].cartas = this.state.jogadores[socketId].cartas.filter((c) => c.code !== carta.code);        
        this.state.maoAtual.movimentacoes.push(movimentacao);
        
        const cartasJogadas = this.state.maoAtual.movimentacoes.filter((m) => m.tipo == 'jogada');

        if (cartasJogadas.length == 4) {
            const movimentacaoVencedora = obterMovimencacaoVencedora(this.state.maoAtual.movimentacoes);
            equipeVencedoraId = movimentacaoVencedora.jogador.eqp_id;
            rodadaEncerrada = true;
        }

        this.notifyAll({
            type: 'jogada',
            mao: this.state.maoAtual,
            jogadores: this.state.jogadores,
            equipeVencedoraId,
            rodadaEncerrada
        });
    }

    EncerrarRodada(command) {
        const equipeVencedoraId = command.equipeVencedoraId;
        let maoEncerrada = false;

        const rodada = {
            id: Math.floor(Math.random() * 1000000),
            equipeVencedora: equipeVencedoraId,
            movimentacoes: this.state.maoAtual.movimentacoes
        };
        this.state.maoAtual.rodadas.push(rodada);
        this.state.maoAtual.movimentacoes = [];

        // se 2 rodadas ou + foram vencidas, avisaremos que a rodada foi encerrada.
        if (this.state.maoAtual.rodadas.filter((r) => r.equipeVencedora == equipeVencedoraId).length >= 2) {
            maoEncerrada = true;
            this.state.maoAtual.equipeVencedoraId = equipeVencedoraId;
        }

        this.notifyAll({
            type: 'rodada-encerrada',
            mao: this.state.maoAtual,
            equipeVencedoraId,
            maoEncerrada
        });
    }

    EncerrarMao() {
        this.state.maos.push(this.state.maoAtual);
        
        const jogoEncerrado = obterTotalPontosPorEquipe(this.state.maos, this.state.maoAtual.equipeVencedoraId) >= 12;

        if (jogoEncerrado) {
            this.notifyAll({
                type: 'mao-encerrada',
                mao: this.state.maoAtual,
                equipeVencedoraId: this.state.maoAtual.equipeVencedoraId,
                jogoEncerrado
            });
            return;
        }

        this.AdicionarMao({
            sal_id: this.state.maoAtual.sal_id, 
            maoAnterior: this.state.maoAtual
        });
    }

    trucar(command) {
        const { socketId } = command;
        
        this.state.maoAtual.movimentacoes.push({
            id: Math.floor(Math.random() * 1000000),
            tipo: 'pediu-truco',
            jogador: this.state.jogadores[socketId]
        });

        this.notifyAll({
            type: 'pediu-truco',
            jogador: this.state.jogadores[socketId]
        });
    }

    aceitarTruco(command) {
        const { socketId } = command;
        
        this.state.maoAtual.trucada = 'S';
        this.state.valor = 3;
        this.state.maoAtual.movimentacoes.push({
            id: Math.floor(Math.random() * 1000000),
            tipo: 'aceitou-truco',
            jogador: this.state.jogadores[socketId]
        });

        this.notifyAll({
            type: 'aceitou-truco',
            jogador: this.state.jogadores[socketId]
        });
    }

    correrDoTruco(command) {
        const { socketId } = command;
        
        const movimentacao = {
            id: Math.floor(Math.random() * 1000000),
            tipo: 'correu',
            jogador: this.state.jogadores[socketId]
        };
        this.state.maoAtual.movimentacoes.push(movimentacao);

        const equipeVencedoraId = this.state.jogadores[socketId].eqp_id == 1 ? 2 : 1;

        this.notifyAll({
            type: 'correu',
            mao: this.state.maoAtual,
            jogadores: this.state.jogadores,
            equipeVencedoraId: equipeVencedoraId,
            rodadaEncerrada: true
        });
    }
}