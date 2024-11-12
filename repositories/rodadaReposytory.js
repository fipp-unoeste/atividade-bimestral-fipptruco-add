import RodadaEntity from "../entities/rodadaEntity.js";
import BaseRepository from "./baseRepository.js";

export class RodadaRepository extends BaseRepository{
    constructor(db) {
        super(db);
        this.db = db; 
    }
    
}