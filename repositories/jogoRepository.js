import JogoEntity from "../entities/jogoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class JogoRepository extends BaseRepository{
    constructor(db) {
        super(db);
    }
    
    async iniciar(jogo){
    	const sql = `INSERT INTO tb_jogo (jog_dtinicio, jog_dtfim, sal_id) values (?,?,?)`
        const params = [jogo.jogoDtInicio, jogo.jogoDtFim, jogo.salaId]
        let jogoId = await this.db.ExecutaComandoLastInserted(sql, params);
        console.log(jogoId);
        if(jogoId > 0){
            return jogoId;
        }
        else{
            return null;
        }
    }

    async terminar(jogo){
        let sql = "UPDATE tb_jogo SET jog_dtfim = ? WHERE (jog_id = ?)"
        
        let params = [jogo.jogoDtFim, jogo.jogoId]
        
        let result = await this.db.ExecutaComandoNonQuery(sql, params);
    
        return result;
    }

    async obter(id) {
        let sql = "select * from tb_jogo where jog_id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    toMap(rows) {
        if (!rows) return null;
    
        return Array.isArray(rows) 
        ? rows.map(row => {
            const jogo = new JogoEntity();
            jogo.jogoId = row.jog_id;
            jogo.jogoDtInicio = row.jog_dtinicio;
            jogo.jogoDtFim = row.jog_dtfim;
            jogo.salaId = row.sal_id;
            return jogo;
        }) 
        : new JogoEntity(rows.jog_id, rows.jog_dtinicio, rows.jog_dtfim, rows.sal_id);
    }
}
