
import UsuarioRepository from "../repositories/usuarioRepository.js";
import UsuarioEntity from "../entities/usuarioEntity.js";

export default class UsuarioController {

    async gravar(req, res) {
       
        try {
            const { nome, email, senha } = req.body;
            if (!nome || !email || !senha) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
    
            const entidade = new UsuarioEntity(0, nome, email, senha);
            const repo = new UsuarioRepository();
            const result = await repo.gravar(entidade);
    
            if (result) {
                return res.status(201).json({ msg: "Usuário cadastrado com sucesso!" });
            } else {
                throw new Error("Erro ao cadastrar usuário no banco de dados");
            }
        } catch (ex) {
            console.error("Erro no cadastro:", ex); // Log do erro
            return res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
        }
    }

    async buscarUsuario(req, res) {
         console.log('teste');
        try{
            let {email, senha } = req.body;
            let usuario = new UsuarioRepository();
            let entidade = await usuario.validarAcesso(email,senha);
            if(entidade == null){
                res.status(400).json({msg: 'Usuário não encontrado',ok:false})
            }
            res.status(200).json(entidade);
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }
    
}