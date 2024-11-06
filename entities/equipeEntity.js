import BaseEntity from "./baseEntity.js";

export default class EquipeEntity extends BaseEntity{
    
    #eqp_id;
    #eqp_descricao;

    get eqp_id() {return this.#eqp_id;}
    set eqp_id(value) {this.#eqp_id = value;}

    get eqp_descricao() {return this.#eqp_descricao;}
    set eqp_descricao(value) {this.#eqp_descricao = value;}

    constructor(eqp_id, eqp_descricao) {
        super();
        this.#eqp_id = eqp_id;
        this.#eqp_descricao = eqp_descricao;
    }
}