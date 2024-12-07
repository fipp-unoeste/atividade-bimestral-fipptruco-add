import ParticipanteEntity from "../entities/participanteEntity.js";
import UsuarioEntity from "../entities/usuarioEntity.js";
import BaseRepository from "./baseRepository.js";

export default class ParticipanteRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async listar() {
        let sql = "select * from tb_participante";
        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        return this.toMap(rows);
    } 

    async gravar(participante) {
        const query = `INSERT INTO tb_participante (entrada, saida, usu_id, sal_id, eqp_id)VALUES (?, ?, ?, ?, ?)`;

        const params = [
            participante.entrada,
            participante.saida,
            participante.usu_id,
            participante.sal_id,
            participante.eqp_id
        ];

        try {
            const [result] = await db.ExecutaComandoNonQuery(query, params);
            return result.insertId;
        } catch (error) {
            console.error("Erro ao gravar participante:", error);
            throw error;
        }
    }

    async buscarPorSala(sal_id) {
        const query = `
            SELECT * FROM tb_participante
            WHERE sal_id = ? and par_dtsaida IS NULL
        `;

        try {
            const rows = await this.db.ExecutaComando(query, [sal_id]);
            return rows.map(row => new ParticipanteEntity(
                row.par_id,
                row.entrada,
                row.saida,
                row.usu_id,
                row.sal_id,
                row.eqp_id
            ));
        } catch (error) {
            console.error("Erro ao buscar participantes por sala:", error);
            throw error;
        }
    }

//buscarPorIdESala
async buscarPorUsuarioESala(sal_id, usu_id) {
    const query = `
        SELECT * FROM tb_participante
        WHERE sal_id = ? and usu_id = ? and par_dtsaida IS NULL
    `;

    try {
        const [rows] = await this.db.ExecutaComando(query, [sal_id, usu_id]);
        return this.toMap(rows);
    } catch (error) {
        console.error("Erro ao buscar participante por ID:", error);
        throw error;
    }
}

async buscarPorId(id) {
    let sql = "select * from tb_participante where par_id = ?";
    let valores = [id];

    let row = await this.db.ExecutaComando(sql, valores);
    return this.toMap(row[0]);
}

    async atualizar(participante) {
        const query = `
            UPDATE tb_participante
            SET entrada = ?, saida = ?, usu_id = ?, sal_id = ?, eqp_id = ?
            WHERE par_id = ?
        `;

        const params = [
            participante.entrada,
            participante.saida,
            participante.usu_id,
            participante.sal_id,
            participante.eqp_id,
            participante.par_id
        ];

        try {
            const [result] = await db.ExecutaComandoNonQuery(query, params);
            return result.affectedRows > 0; 
        } catch (error) {
            console.error("Erro ao atualizar participante:", error);
            throw error;
        }
    }

    async listarParticipantes(salaId) {
        try {
            const query = `SELECT * FROM tb_participante WHERE sal_id = ? and par_dtsaida IS NULL`;
            let rows = await this.db.ExecutaComando(query, [salaId]); 

             return this.toMap(rows);
        } catch (error) {
            console.error("Erro ao listar participantes:", error);
            throw new Error("Erro ao listar os participantes: " + error.message);
        }
    }

    // Adicionar um participante à sala
    async adicionarParticipante(salaId, usuarioId, eqp_id, dataEntrada = new Date()) {
        try {


            const query = `INSERT INTO tb_participante (sal_id, usu_id, par_dtentrada, eqp_id) VALUES (?, ?, ?, ?)`;
            const participanteId = await this.db.ExecutaComandoLastInserted(query, [salaId, usuarioId, dataEntrada, eqp_id]);
           
            if(participanteId > 0){
                return participanteId;
            }
            else{
                return null;
            }
        } catch (error) {
            throw new Error("Erro ao adicionar participante: " + error.message);
        }
    }


    async removerParticipante(salaId, usuarioId, dataSaida = new Date()) {
        try {
            const query = `
                UPDATE tb_participante 
                SET par_dtsaida = ? 
                WHERE sal_id = ? AND usu_id = ? AND par_dtsaida IS NULL`;
            const result = await this.db.ExecutaComandoNonQuery(query, [dataSaida, salaId, usuarioId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error("Erro ao remover participante: " + error.message);
        }
    }
    
    toMap(rows) {
        if (!rows) return null;
    
        return Array.isArray(rows) 
        ? rows.map(row => {
            const participante = new ParticipanteEntity();
            participante.par_id = row.par_id;
            participante.entrada = row.entrada;
            participante.saida= row.saida;
            participante.usu_id = row.usu_id;
            participante.sal_id = row.sal_id;
            participante.eqp_id = row.eqp_id;
            return participante;
        }) 
        : new ParticipanteEntity(rows.par_id, rows.entrada, rows.saida, rows.usu_id, rows.sal_id, rows.eqp_id);
    }
}