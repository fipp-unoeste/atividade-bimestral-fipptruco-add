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

    toMap(rows) {
        if (!rows) return null;
    
        const usuario = new UsuarioEntity();
        usuario.id = rows["usu_id"];
        usuario.nome = rows["usu_nome"];
        usuario.email = rows["usu_email"];
        usuario.senha = rows["usu_senha"];
        let retorno = Array.isArray(rows) == false ? usuario : [usuario];
        console.log('retorno:', retorno);
        return retorno;
    }
}