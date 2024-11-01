import BaseEntity from "./baseEntity.js";

export default class SalaEntity extends BaseEntity{
    
    #sal_id;
    #nome;
    #usu_id;

    get sal_id() {return this.#sal_id;}
    set sal_id(value) {this.#sal_id = value;}

    get nome() {return this.#nome;}
    set nome(value) {this.#nome = value;}

    get usu_id() {return this.#usu_id}
    set usu_id(value) {this.#usu_id = value;}

    constructor(sal_id, nome, usu_id) {
        super();
        this.#sal_id = sal_id;
        this.#nome = nome;
        this.#usu_id = usu_id;
    }
}