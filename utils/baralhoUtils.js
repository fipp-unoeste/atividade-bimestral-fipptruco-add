import Adapter from "../adapters/adapter.js";

let trucoValores = {
    "4": 1,
    "5": 2,
    "6": 3,
    "7": 4,
    "QUEEN": 5,
    "JACK": 6,
    "KING": 7,
    "ACE": 8,
    "2": 9,
    "3": 10,
};

let ordemNaipes = ["DIAMONDS", "SPADES", "HEARTS", "CLUBS"];

const calcularValorCarta = (card, vira) => {
    // Determinar o valor da vira
    const viraValue = trucoValores[vira.value];
    const manilhaValue = viraValue === 10 ? 1 : viraValue + 1;
  
    // Checar se a carta é uma manilha
    if (trucoValores[card.value] === manilhaValue) {
      const suitIndex = ordemNaipes.indexOf(card.suit);
      return 11 + suitIndex; // Manilhas são mais fortes que 10
    }
  
    // Caso contrário, retorna o valor mapeado
    return trucoValores[card.value] || 0; // Retorna 0 para valores desconhecidos
};

const obterCartasNiveladas = (cartas, vira) => {
    return cartas.map((carta) => {
        return {
            ...carta,
            peso: calcularValorCarta(carta, vira),
        };
    });
};

export const obterCartas = async () => {
    const adapter = new Adapter();
    const deck = await adapter.novoDeck();
    const cartas = await adapter.sacar13Cartas(deck.deck_id);
    return obterCartasNiveladas(cartas.cards, cartas.cards[0]);
}

export const obterMovimencacaoVencedora = (movimentacoes) => {
    const movimentacoesJogadas = movimentacoes.filter((m) => m.tipo == 'jogada');

    // Usando reduce para encontrar o item com o maior peso
    const movimentacaoVencedora = movimentacoesJogadas.reduce((max, item) => {
        return item.carta.peso > max.carta.peso ? item : max;
    }, movimentacoesJogadas[0]);

    return movimentacaoVencedora;
}

export const obterTotalPontosPorEquipe = (maos, equipe) => {
    return maos.filter((m) => m.equipeVencedoraId == equipe).reduce((sum, mao) => sum + mao.valor, 0)
}

export const distribuirCartasParaJogadores = (cartas, jogadores) => {
    const cartasPorJogador = 3;
    const jogadoresAtualizados = {};

    Object.entries(jogadores).forEach(([id, jogador], index) => {
        const inicio = index * cartasPorJogador; // Índice inicial para o slice
        const cartasDoJogador = cartas.slice(inicio, inicio + cartasPorJogador); // Pega 3 cartas
        jogadoresAtualizados[id] = {
            ...jogador,
            cartas: cartasDoJogador,
        };
    });

    return jogadoresAtualizados;
}

export const calcularOrdemDeTurnos = (jogadores) => {
    const jogadoresEquipe1 = jogadores.filter((jogador) => jogador.eqp_id == 1);
    const jogadoresEquipe2 = jogadores.filter((jogador) => jogador.eqp_id == 2);

    // Combine os jogadores alternando entre as equipes
    const ordemTurnos = [];
    for (let i = 0; i < Math.max(jogadoresEquipe1.length, jogadoresEquipe2.length); i++) {
        if (jogadoresEquipe1[i]) ordemTurnos.push(jogadoresEquipe1[i]);
        if (jogadoresEquipe2[i]) ordemTurnos.push(jogadoresEquipe2[i]);
    }

    return ordemTurnos;
}

export const alternarJogadorAtual = (jogadorAtual, ordemTurnos) => {
    const indiceAtual = ordemTurnos.indexOf(jogadorAtual);
    const proximoIndice = (indiceAtual + 1) % ordemTurnos.length;

    return ordemTurnos[proximoIndice];
}