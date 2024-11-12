import JogoEntity from "../entities/jogoEntity.js";
import BaseRepository from "./baseRepository.js";

export class JogoRepository extends BaseRepository{
    constructor(db) {
        super(db);
        this.db = db; 
    }
    
    async iniciar(jogo){
        const sql = `INSERT INTO tb_jogo (jog_dtinicio, jog_dtfim, sal_id) values (?,?,?)`
        const params = [jogo.jogo_dtinicio, jogo.jogo_dtfim, jogo.salaId]

            let jogoId = await this.db.ExecutaComandoLastInserted(sql, params);
            if(jogoId > 0){
                return salaId;
            }
            else{
                return null;
            }
    }

    async terminar(jogo){
        let sql = "UPDATE tb_jogo SET jog_dtfim = ? WHERE (jog_id = ?)"
        
        let params = [jogo.jogo_dtfim, jogo.jogoId]
        
        let result = await banco.ExecutaComandoNonQuery(sql, params);
    
        return result;
    }
    

}


