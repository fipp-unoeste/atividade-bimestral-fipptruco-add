import SalaEntity from "../entities/salaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class SalaRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "select * from tb_sala";
        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        return this.toMap(rows);
    }  

    toMap(rows) {
        if (!rows) return null;
    
        const sala = new SalaEntity();
        sala.sal_id = rows["sal_id"];
        sala.nome = rows["sal_nome"];
        sala.id = rows["usu_id"];
        
        return Array.isArray(rows) ? sala : [sala];
    }
}