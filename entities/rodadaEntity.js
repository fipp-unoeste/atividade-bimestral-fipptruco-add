import BaseEntity from "./baseEntity.js";

export default class RodadaEntity extends BaseEntity {
    #rod_id;
    #mao_id;
    #eqp_vencedora;

    constructor(rod_id, mao_id, eqp_vencedora) {
        super();
        this.#rod_id = rod_id;
        this.#mao_id = mao_id;
        this.#eqp_vencedora = eqp_vencedora;
    }

    get rodId() { return this.#rod_id; }
    set rodId(value) { this.#rod_id = value; }

    get maoId() { return this.#mao_id; }
    set maoId(value) { this.#mao_id = value; }

    get eqpVencedora() { return this.#eqp_vencedora; }
    set eqpVencedora(value) { this.#eqp_vencedora = value; }
}
