import UsuarioEntity from "../entities/usuarioEntity.js";
import BaseRepository from "./baseRepository.js";

export default class UsuarioRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async validarAcesso(email, senha) {

        let sql = "select * from tb_usuario where usu_email = ? and usu_senha = ?";
        let valores = [email, senha];
        let row = await this.db.ExecutaComando(sql, valores);
        let usuario = this.toMap(row[0]);

        return usuario;
    }

    async obter(id) {
        let sql = "select * from tb_usuario where usu_id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async gravar(entidade) {
        
        let sql = "insert into tb_usuario (usu_nome, usu_email, usu_senha) values (?, ?, ?)";

        let valores = [entidade.nome, entidade.email, entidade.senha];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }


    async buscarOutrosPorSala(sal_id, usu_id) {
        const query = `
            SELECT u.* 
            FROM tb_participante p 
            join tb_usuario u on u.usu_id = p.usu_id
            WHERE sal_id = ? and p.usu_id <> ?
        `;

        try {
            const rows = await this.db.ExecutaComando(query, [sal_id, usu_id]);
            return this.toMap(rows);
        } catch (error) {
            console.error("Erro ao buscar participantes por sala:", error);
            throw error;
        }
    }

    toMap(rows) {
        if (!rows) return null;
    
        return Array.isArray(rows) 
        ? rows.map(row => {
            const usuario = new UsuarioEntity();
            usuario.id = row["usu_id"];
            usuario.nome = row["usu_nome"];
            usuario.email = row["usu_email"];
            usuario.senha = row["usu_senha"];
            return usuario;
        }) 
        : new UsuarioEntity(
            rows.usu_id,
            rows.usu_nome,
            rows.usu_email,
            rows.usu_senha
        );
    }
}