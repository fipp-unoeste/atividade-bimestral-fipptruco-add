import CartaRepository from "../repositories/cartaRepository.js";
import MaoRepository from "../repositories/maoRepository.js";
import ParticipanteRepository from "../repositories/participanteRepository.js";
import CartaEntity from "../entities/cartaEntity.js";
import Adapter from "../adapters/adapter.js";

export default class CartaController {

    #trucoValores = {
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

    //ouros, espadas, copas, paus
    #ordemNaipes = ["DIAMONDS", "SPADES", "HEARTS", "CLUBS"];

    calcularValorVira = (card, vira) => {
        // Determina o valor da vira
        const viraValue = this.#trucoValores[vira.value];
        const manilhaValue = viraValue === 10 ? 1 : viraValue + 1;
     
        // Checar se a carta é uma manilha
        if (this.#trucoValores[card.value] === manilhaValue) {
          const suitIndex = this.#ordemNaipes.indexOf(card.suit);
          return 11 + suitIndex; // Manilhas são mais fortes que 10
        }
     
        // Caso contrário, retorna o valor mapeado
        return this.#trucoValores[card.value] || 0; // Retorna 0 para valores desconhecidos
    };


    calcularValorCarta = (card, viraValue) => {
        const manilhaValue = viraValue === 10 ? 1 : viraValue + 1;
     
        // Checar se a carta é uma manilha
        if (this.#trucoValores[card.value] === manilhaValue) {
          const suitIndex = this.#ordemNaipes.indexOf(card.suit);
          return 11 + suitIndex; // Manilhas são mais fortes que 10
        }
     
        // Caso contrário, retorna o valor mapeado
        return this.#trucoValores[card.value] || 0; // Retorna 0 para valores desconhecidos
    };

    async distribuirParaParticipante(req, res) {
        try {
            const { maoId, participanteId, viraId } = req.body;

            if (!maoId || !participanteId || !viraId) {
                return res.status(400).json({ msg: "A maoId, participanteId e viraId deve ser informado!" });
            }

            const maoRepository = new MaoRepository();
            const mao = await maoRepository.obter(maoId);
            if (!mao) {
                return res.status(400).json({ msg: "Mao inexistente!" });
            }

            const participanteRepository = new ParticipanteRepository();
            var participante = await participanteRepository.buscarPorId(participanteId);
            if (!participante) {
                return res.status(400).json({ msg: "Participante inexistente!" });
            }

            const cartaRepository = new CartaRepository();
            var vira = await cartaRepository.buscarPorId(viraId);
            if (!vira) {
                return res.status(400).json({ msg: "Vira inexistente!" });
            }

            const adapter = new Adapter();
            var cardDraws = await adapter.distribuirCartasParaParticipante(mao.maoCodigoBaralho);

            if (!cardDraws.success) {
                return res.status(400).json({ msg: "Cartas não distribuídas, verifique a requisição!" });
            }

            const cartas = [];

            for (const card of cardDraws.cards) {
                const valorCarta = this.calcularValorCarta(card, vira.carValor);
                const carta = new CartaEntity(0, card.code, card.image, valorCarta, card.suit, "N", participanteId, maoId);
                const cartaId = await cartaRepository.cadastrar(carta);
                if (!cartaId) {
                    return res.status(400).json({ msg: "Erro ao cadastrar cartas!", card });
                }
                carta.carId = cartaId;
                cartas.push(carta);
            }

            return res.status(201).json({ msg: "Cartas distribuidas com sucesso!", cartas});
        } catch (error) {
            console.error("Erro ao gravar rodada:", error);
            return res.status(500).json({ msg: "Erro interno ao cadastrar o Rodada." });
        }
    }

    async registrarVira(req, res) {
        try {
            const { maoId } = req.body;

            if (!maoId) {
                return res.status(400).json({ msg: "A maoId deve ser informado!" });
            }

            const maoRepository = new MaoRepository();
            const mao = await maoRepository.obter(maoId);
            if (!mao) {
                return res.status(400).json({ msg: "Mao inexistente!" });
            }

            const adapter = new Adapter();
            var cardDraws = await adapter.virarCarta(mao.maoCodigoBaralho);

            if (!cardDraws.success) {
                return res.status(400).json({ msg: "Não foi possível fazer o draw da vira, verifique a requisição!" });
            }

            const cartaRepository = new CartaRepository();
            const valorVira = this.calcularValorVira(cardDraws.cards[0], cardDraws.cards[0]);
            const vira = new CartaEntity(0, cardDraws.cards[0].code, cardDraws.cards[0].image, valorVira, cardDraws.cards[0].suit, "S", null, maoId);
            const cartaId = await cartaRepository.cadastrar(vira);
            if (!cartaId) {
                return res.status(400).json({ msg: "Erro ao cadastrar cartas!", card });
            }
            vira.carId = cartaId;

            return res.status(201).json({ msg: "Vira cadastrada com sucesso!", vira});
        } catch (error) {
            console.error("Erro ao gravar vira:", error);
            return res.status(500).json({ msg: "Erro interno ao cadastrar a vira." });
        }
    }
}
