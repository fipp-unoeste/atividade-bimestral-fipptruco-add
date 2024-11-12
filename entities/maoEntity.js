import BaseEntity from "./baseEntity.js";

export default class Mao extends BaseEntity {
    #mao_id;
    #mao_ordem;
    #mao_codigobaralho;
    #mao_trucada;
    #mao_valor;
    #jogo_id;
    #eqp_vencedora;

    constructor(mao_id, mao_ordem, mao_codigobaralho, mao_trucada, mao_valor, jogo_id, eqp_vencedora) {
        super();
        this.#mao_id = mao_id;
        this.#mao_ordem = mao_ordem;
        this.#mao_codigobaralho = mao_codigobaralho;
        this.#mao_trucada = mao_trucada;
        this.#mao_valor = mao_valor;
        this.#jogo_id = jogo_id;
        this.#eqp_vencedora = eqp_vencedora;
    }

    get maoId() { return this.#mao_id; }
    set maoId(value) { this.#mao_id = value; }

    get maoOrdem() { return this.#mao_ordem; }
    set maoOrdem(value) { this.#mao_ordem = value; }

    get maoCodigoBaralho() { return this.#mao_codigobaralho; }
    set maoCodigoBaralho(value) { this.#mao_codigobaralho = value; }

    get maoTrucada() { return this.#mao_trucada; }
    set maoTrucada(value) { this.#mao_trucada = value; }

    get maoValor() { return this.#mao_valor; }
    set maoValor(value) { this.#mao_valor = value; }

    get jogoId() { return this.#jogo_id; }
    set jogoId(value) { this.#jogo_id = value; }

    get eqpVencedora() { return this.#eqp_vencedora; }
    set eqpVencedora(value) { this.#eqp_vencedora = value; }
}
