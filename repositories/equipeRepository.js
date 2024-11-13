import BaseRepository from "./baseRepository.js";
import EquipeEntity from "../entities/equipeEntity.js"; 

export default class EquipeRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async listar() {
        const sql = "SELECT * FROM tb_equipe";
        try {
            const rows = await this.db.ExecutaComando(sql);
            return this.toMap(rows);
        } catch (error) {
            console.error("Erro ao listar equipes:", error);
            throw error;
        }
    }

    async listarPorSala(sal_id) {
        const sql = `SELECT e.*
                     FROM tb_equipe e
                     join tb_participante p on p.eqp_id = e.eqp_id
                     where p.sal_id = ?`;
        try {
            const rows = await this.db.ExecutaComando(sql, [sal_id]);
            return this.toMap(rows);
        } catch (error) {
            console.error("Erro ao listar equipes:", error);
            throw error;
        }
    }

    async gravar(equipe) {
        const sql = `INSERT INTO tb_equipe (eqp_descricao) VALUES (?)`;
        const params = [equipe.eqp_descricao];
        
        try {
            const [result] = await this.db.ExecutaComando(sql, params);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao gravar equipe:", error);
            throw error;
        }
    }

    async buscarPorId(eqp_id) {
        const sql = `SELECT * FROM tb_equipe WHERE eqp_id = ?`;
        
        try {
            const [rows] = await this.db.ExecutaComando(sql, [eqp_id]);
            if (rows.length === 0) {
                return null; 
            }
            return this.toMap(rows)[0]; 
        } catch (error) {
            console.error("Erro ao buscar equipe por ID:", error);
            throw error;
        }
    }

    toMap(rows) {
        if (!rows) return null;
    
        return Array.isArray(rows) 
        ? rows.map(row => {
            const equipe = new EquipeEntity();
            equipe.eqp_id = row.eqp_id;
            equipe.eqp_descricao = row.eqp_descricao;
            return equipe;
        }) 
        : new EquipeEntity(rows.eqp_id, rows.eqp_descricao);
    }
}
