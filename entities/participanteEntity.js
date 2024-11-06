import BaseEntity from "./baseEntity.js";

export default class ParticipanteEntity extends BaseEntity{
    
    #par_id;
    #entrada;
    #saida;
    #usu_id;
    #sal_id;
    #eqp_id;

    get par_id() {return this.#par_id;}
    set par_id(value) {this.#par_id = value;}

    get entrada() {return this.#entrada;}
    set entrada(value) {this.#entrada = value;}

    get saida() {return this.#saida}
    set saida(value) {this.#saida = value;}

    get usu_id() {return this.#usu_id;}
    set usu_id(value) {this.#usu_id = value;}

    get sal_id() {return this.#sal_id;}
    set sal_id(value) {this.#sal_id = value;}

    get eqp_id() {return this.#eqp_id;}
    set eqp_id(value) {this.#eqp_id = value;}

    constructor(par_id, entrada, saida, usu_id, sal_id, eqp_id) {
        super();
        this.#par_id = par_id;
        this.#entrada = entrada;
        this.#saida = saida;
        this.#usu_id = usu_id;
        this.#sal_id = sal_id;
        this.#eqp_id = eqp_id
    }
}