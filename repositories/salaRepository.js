import SalaEntity from "../entities/salaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class SalaRepository extends BaseRepository {

    constructor(db) {
        super(db);
        this.db = db; 
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

    async buscarPorId(sal_id) {
        const query = `
            SELECT * FROM tb_sala
            WHERE sal_id = ?
        `;

        try {
            const [rows] = await db.execute(query, [sal_id]);
            return rows.length > 0; 
        } catch (error) {
            console.error("Erro ao buscar sala por ID:", error);
            throw error;
        }
    }

    async listarParticipantes(salaId) {
        try {
            const query = `SELECT * FROM tb_participante WHERE sal_id = ?`;
            const [result] = await db.execute(query, [salaId]); 
            return result;
        } catch (error) {
            throw new Error("Erro ao listar os participantes: " + error.message);
        }
    }

    // Adicionar um participante à sala
    async adicionarParticipante(salaId, nome) {
        try {
            const query = `INSERT INTO tb_participante (sal_id, nome) VALUES (?, ?)`;
            const [result] = await db.execute(query, [salaId, nome]);
            
            if (result.affectedRows > 0) {
                return true;
            } else {
                throw new Error("Falha ao adicionar participante.");
            }
        } catch (error) {
            throw new Error("Erro ao adicionar participante: " + error.message);
        }
    }

    async removerParticipante(salaId, nome) {
        try {
            const query = `DELETE FROM tb_participante WHERE sal_id = ?`;
            const [result] = await db.execute(query, [salaId, nome]);
            
            if (result.affectedRows > 0) {
                return true; 
            } else {
                throw new Error("Falha ao remover participante.");
            }
        } catch (error) {
            throw new Error("Erro ao remover participante: " + error.message);
        }
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