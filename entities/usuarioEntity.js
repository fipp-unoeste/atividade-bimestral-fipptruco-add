import BaseEntity from "./baseEntity.js";

export default class UsuarioEntity extends BaseEntity{
    
    #id;
    #nome;
    #email;
    #senha;

    get id() {return this.#id;}
    set id(value) {this.#id = value;}

    get nome() {return this.#nome;}
    set nome(value) {this.#nome = value;}

    get email() {return this.#email}
    set email(value) {this.#email = value;}

    get senha() {return this.#senha;}
    set senha(value) {this.#senha = value;}

    constructor(id, nome, email, senha) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
    }
}