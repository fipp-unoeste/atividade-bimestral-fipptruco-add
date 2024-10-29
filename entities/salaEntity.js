import BaseEntity from "./baseEntity.js";

export default class SalaEntity extends BaseEntity{
    
    #sal_id;
    #nome;
    #id;

    get sal_id() {return this.#sal_id;}
    set sal_id(value) {this.#sal_id = value;}

    get nome() {return this.#nome;}
    set nome(value) {this.#nome = value;}

    get id() {return this.#id}
    set id(value) {this.#id = value;}

    constructor(sal_id, nome, id) {
        super();
        this.#sal_id = sal_id;
        this.#nome = nome;
        this.#id = id;
    }
}