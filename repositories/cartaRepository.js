import CartaEntity from "../entities/cartaEntity.js";
import BaseRepository from "./baseRepository.js";

export class CartaRepository extends BaseRepository{
    constructor(db) {
        super(db);
        this.db = db; 
    }
    
}