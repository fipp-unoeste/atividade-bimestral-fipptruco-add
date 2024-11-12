import BaseEntity from "./baseEntity.js";

export default class MovimentacaoEntity extends BaseEntity {
    #mov_id;
    #mov_ordem;
    #mov_correu;
    #mov_trucou;
    #car_id;
    #rod_id;
    #par_id;

    constructor(mov_id, mov_ordem, mov_correu, mov_trucou, car_id, rod_id, par_id) {
        super();
        this.#mov_id = mov_id;
        this.#mov_ordem = mov_ordem;
        this.#mov_correu = mov_correu;
        this.#mov_trucou = mov_trucou;
        this.#car_id = car_id;
        this.#rod_id = rod_id;
        this.#par_id = par_id;
    }

   
    get movId() { return this.#mov_id; }
    set movId(value) { this.#mov_id = value; }

    get movOrdem() { return this.#mov_ordem; }
    set movOrdem(value) { this.#mov_ordem = value; }

   
    get movCorreu() { return this.#mov_correu; }
    set movCorreu(value) { this.#mov_correu = value; }

   
    get movTrucou() { return this.#mov_trucou; }
    set movTrucou(value) { this.#mov_trucou = value; }

  
    get carId() { return this.#car_id; }
    set carId(value) { this.#car_id = value; }

   
    get rodId() { return this.#rod_id; }
    set rodId(value) { this.#rod_id = value; }

    
    get parId() { return this.#par_id; }
    set parId(value) { this.#par_id = value; }
}
