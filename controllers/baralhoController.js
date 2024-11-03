import Adapter from "../adapters/adapter.js";

export default class BaralhoController {
    #deckId;

    constructor() {
        this.#deckId = ""; // Inicializa #deckId no construtor com valor vazio
    }

    get deckId() { return this.#deckId; }
    set deckId(value) { this.#deckId = value; }

    async novaMao(req, res) {
        try {
            let adapter = new Adapter();
            let mao = await adapter.novaMao();
            this.deckId = adapter.deck_id; // Atualiza o #deckId com a resposta da API

            if (mao) {
                res.status(200).json(mao);
                console.log("Nova mão:", this.deckId);
            } else {
                res.status(400).json({ msg: "Mão de baralho não encontrada, verifique se a requisição foi informada corretamente." });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async distribuirCartas(req, res) {
        console.log("Mão a ser distribuída:", this.deckId);
        try {
            if (!this.deckId) {
                return res.status(400).json({ msg: "Mão de cartas indefinida. Por favor, crie uma nova mão primeiro." });
            }
            let adapter = new Adapter(this.deckId); // Passa o deckId para o Adapter
            let cartas = await adapter.distribuirCartas(); // Chama distribuirCartas do Adapter

            if (cartas.success) {
                res.status(200).json(cartas);
            } else {
                res.status(400).json({ msg: "Cartas não distribuídas, verifique a requisição." });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async virarCarta(req, res){
        console.log("Mão de carta de onde sairá a 'vira':", this.deckId);
        try {
            if (!this.deckId) {
                return res.status(400).json({ msg: "Mão de cartas indefinida. Por favor, crie uma nova mão primeiro." });
            }
            let adapter = new Adapter(this.deckId); // Passa o deckId para o Adapter
            let cartas = await adapter.virarCarta(); // Chama distribuirCartas do Adapter

            if (cartas.success) {
                res.status(200).json(cartas);
            } else {
                res.status(400).json({ msg: "Carta não virada, verifique a requisição." });
            }
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }

    }
}
