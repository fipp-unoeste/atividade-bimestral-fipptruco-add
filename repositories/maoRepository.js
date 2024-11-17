import MaoEntity from "../entities/maoEntity.js";
import BaseRepository from "./baseRepository.js";


export default class MaoRepository extends BaseRepository{
    constructor(db) {
        super(db);
    }
   
    async iniciar(mao){
        const sql = 'INSERT INTO tb_mao (mao_ordem, mao_codigobaralho, mao_trucada, mao_valor, jog_id, eqp_vencedora) values (?,?,?,?,?,?)'
        const params = [mao.maoOrdem, mao.maoCodigoBaralho, mao.maoTrucada, mao.maoValor, mao.jogoId, mao.eqpVencedora]


        let maoId = await this.db.ExecutaComandoLastInserted(sql, params);
        if(maoId > 0){
            return maoId;
        }
        else{
            return null;
        }
    }


    async atualizar(mao){
        let sql = "UPDATE tb_mao SET mao_ordem = ?, mao_codigobaralho = ?, mao_trucada = ?, mao_valor = ?, jog_id = ?, eqp_vencedora = ? WHERE (mao_id = ?)"
       
        let params = [mao.maoOrdem, mao.maoCodigoBaralho, mao.maoTrucada, mao.maoValor, mao.jogoId, mao.eqpVencedora, mao.maoId]
       
        let result = await this.db.ExecutaComandoNonQuery(sql, params);
   
        return result;
    }


    async obter(id) {
        let sql = "select * from tb_mao where mao_id = ?";
        let valores = [id];


        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }


    toMap(rows) {
        if (!rows) return null;
   
        return Array.isArray(rows)
        ? rows.map(row => {
            const jogo = new MaoEntity();
            jogo.maoId = row.mao_id;
            jogo.maoOrdem = row.mao_ordem;
            jogo.maoCodigoBaralho = row.mao_codigobaralho;
            jogo.maoTrucada = row.mao_trucada;
            jogo.maoValor = row.mao_valor;
            jogo.jogoId = row.jog_id;
            jogo.eqpVencedora = row.eqp_vencedora;
            return jogo;
        })
        : new MaoEntity(rows.mao_id, rows.mao_ordem, rows.mao_codigobaralho, rows.mao_trucada, rows.mao_valor, rows.jog_id, rows.eqp_vencedora);
    }
}
