import MovimentacaoEntity from "../entities/movimentacaoEntity.js";
import BaseRepository from "./baseRepository.js";

export class MaoRepository extends BaseRepository{
    constructor(db) {
        super(db);
        this.db = db; 
    }
    
}