import BaseEntity from "./baseEntity.js";

export default class CartaEntity extends BaseEntity {
    #car_id;
    #car_cod;
    #car_img;
    #car_valor;
    #car_naipe;
    #car_vira;
    #par_id;
    #mao_id;

    constructor(car_id, car_cod, car_img, car_valor, car_naipe, car_vira, par_id, mao_id) {
        super();
        this.#car_id = car_id;
        this.#car_cod = car_cod;
        this.#car_img = car_img;
        this.#car_valor = car_valor;
        this.#car_naipe = car_naipe;
        this.#car_vira = car_vira;
        this.#par_id = par_id;
        this.#mao_id = mao_id;
    }

    get carId() { return this.#car_id; }
    set carId(value) { this.#car_id = value; }

    get carCod() { return this.#car_cod; }
    set carCod(value) { this.#car_cod = value; }

    get carImg() { return this.#car_img; }
    set carImg(value) { this.#car_img = value; }

    get carValor() { return this.#car_valor; }
    set carValor(value) { this.#car_valor = value; }

    get carNaipe() { return this.#car_naipe; }
    set carNaipe(value) { this.#car_naipe = value; }

    get carVira() { return this.#car_vira; }
    set carVira(value) { this.#car_vira = value; }

    get parId() { return this.#par_id; }
    set parId(value) { this.#par_id = value; }

    get maoId() { return this.#mao_id; }
    set maoId(value) { this.#mao_id = value; }
}
