import RodadaEntity from "../entities/rodadaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class RodadaRepository extends BaseRepository{
    constructor(db) {
        super(db);
    }

    async iniciar(rodada){
        const sql = `INSERT INTO tb_rodada (mao_id, eqp_vencedora) values (?,?)`
        const params = [rodada.maoId, rodada.eqpVencedora]
        let rodadaId = await this.db.ExecutaComandoLastInserted(sql, params);

        if(rodadaId > 0){
            return rodadaId;
        }
        else{
            return null;
        }
    }

    async atualizar(rodada){
        let sql = "UPDATE tb_rodada SET eqp_vencedora = ? WHERE (rod_id = ?)"
       
        let params = [rodada.eqpVencedora, rodada.rodId]
       
        let result = await this.db.ExecutaComandoNonQuery(sql, params);
   
        return result;
    }

    async obter(id) {
        let sql = "select * from tb_rodada where rod_id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    toMap(rows) {
        if (!rows) return null;
   
        return Array.isArray(rows)
        ? rows.map(row => {
            const rodada = new RodadaEntity();
            rodada.rodId = row.rod_id;
            rodada.maoId = row.mao_id;
            rodada.eqpVencedora = row.eqp_vencedora;
            return rodada;
        })
        : new RodadaEntity(rows.rod_id, rows.mao_id, rows.eqp_vencedora);
    }
}
