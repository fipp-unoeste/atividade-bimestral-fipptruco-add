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

    async buscarPorId(sal_id) {
        const query = `
            SELECT * FROM tb_sala
            WHERE sal_id = ?
        `;

        try {
            const [rows] = await this.db.ExecutaComando(query, [sal_id]);

            return this.toMap(rows); 
        } catch (error) {
            console.error("Erro ao buscar sala por ID:", error);
            throw error;
        }
    }

    // async listarParticipantes(salaId) {
    //     try {
    //         const query = `SELECT * FROM tb_participante WHERE sal_id = ?`;
    //         const result = await this.db.ExecutaComando(query, [salaId]); 

    //         console.log('result do listar participante:', result);

    //         return result;

    //     } catch (error) {
    //         throw new Error("Erro ao listar os participantes: " + error.message);
    //     }
    // }

    // // Adicionar um participante à sala
    // async adicionarParticipante(salaId, usuarioId, dataEntrada = new Date()) {
    //     try {
    //         const dataEntradaFormatada = dataEntrada.toISOString().slice(0, 19).replace('T', ' ');

    //         const query = `INSERT INTO tb_participante (sal_id, usu_id, par_dtentrada) VALUES (?, ?, ?)`;
    //         const [result] = await this.db.ExecutaComandoNonQuery(query, [salaId, usuarioId, dataEntradaFormatada]);
    //         return result.affectedRows > 0;
    //     } catch (error) {
    //         throw new Error("Erro ao adicionar participante: " + error.message);
    //     }
    // }

    // async removerParticipante(salaId, usuarioId, dataSaida = new Date()) {
    //     try {
    //         const query = `
    //             UPDATE tb_participante 
    //             SET par_dtsaida = ? 
    //             WHERE sal_id = ? AND usu_id = ? AND par_dtsaida IS NULL`;
    //         const [result] = await this.db.ExecutaComandoNonQuery(query, [dataSaida, salaId, usuarioId]);
    //         return result.affectedRows > 0;
    //     } catch (error) {
    //         throw new Error("Erro ao remover participante: " + error.message);
    //     }
    // }
    
    toMap(rows) {
        if (!rows) {
           return null;
        }
    
        return Array.isArray(rows) 
        ? rows.map(row => {
            const sala = new SalaEntity();
            sala.sal_id = row.sal_id;
            sala.nome = row.sal_nome;
            sala.usu_id = row.usu_id;
            return sala;
        }) 
        : new SalaEntity(rows.sal_id, rows.sal_nome, rows.usu_id);
    }
}