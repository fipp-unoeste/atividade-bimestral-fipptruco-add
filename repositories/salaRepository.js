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

    async criar(entidade) {
        
        let sql = "insert into tb_sala (sal_nome) values (?)";
        let valores = [entidade.nome];

        let salaId = await this.db.ExecutaComandoLastInserted(sql, valores);
        let result = salaId > 0 ;

        return result;
    }
    
    async atualizar(entidade) {

        let sql = `update tb_sala set sal_nome = ?
                                where sal_id  = ?`;
        let valores = [entidade.nome, entidade.sal_id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    toMap(rows) {
        if (!rows) return null;
    
        return Array.isArray(rows) 
        ? rows.map(row => {
            const sala = new SalaEntity();
            sala.sal_id = row.sal_id;
            sala.nome = row.sal_nome;
            sala.usu_id = row.usu_id;
            return sala;
        }) 
        : null;
    }
}