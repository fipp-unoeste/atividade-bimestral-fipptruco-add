import BaseEntity from "./baseEntity.js";

export default class JogoEntity extends BaseEntity {
    #jogoId;
    #jogo_dtinicio;
    #jogo_dtfim;
    #salaId;

    constructor(jogoId, jogo_dtinicio, jogo_dtfim, salaId) {
        super();
        this.#jogoId = jogoId;
        this.#jogo_dtinicio = jogo_dtinicio;
        this.#jogo_dtfim = jogo_dtfim;
        this.#salaId = salaId;
    }

    get jogoId() { return this.#jogoId; }
    set jogoId(value) { this.#jogoId = value; }

    get jogoDtInicio() { return this.#jogo_dtinicio; }
    set jogoDtInicio(value) { this.#jogo_dtinicio = value; }

    get jogoDtFim() { return this.#jogo_dtfim; }
    set jogoDtFim(value) { this.#jogo_dtfim = value; }

    get salaId() { return this.#salaId; }
    set salaId(value) { this.#salaId = value; }

  
}

