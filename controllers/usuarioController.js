
import UsuarioRepository from "../repositories/usuarioRepository.js";
import UsuarioEntity from "../entities/usuarioEntity.js";
import AuthMiddleware from "../middlewares/authMiddleware.js";

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
            console.error("Erro no cadastro:", ex); 
            return res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
        }
    }

    async buscarUsuario(req, res) {
        try{
            let {email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({ msg: "Email e senha são obrigatórios!" });
            }
            
            let repoUsuario = new UsuarioRepository();
            let usuario = await repoUsuario.validarAcesso(email,senha);

            // if(usuario == null){
            //     res.status(400).json({msg: 'Usuário não encontrado',ok:false, redirect: '/cadastro'});
            // }

            if (!usuario) {
                // Redirecionar para a página de cadastro
                return res.status(302).json({ msg: 'Usuário não encontrado. Redirecionando para cadastro.', redirect: '/cadastro' });
            }

            let auth = new AuthMiddleware();
            let token = auth.gerarToken(usuario.id, usuario.email);
            res.cookie("token", token);
            res.status(200).json({token: token, usuario: usuario});
        }
        catch(ex) {
            console.error("Erro no login:", ex); 
            res.status(500).json({msg: ex.message});
        }
    }

    async info(req, res) {
        try {
            const usuario = req.usuarioLogado;
            
            if (!usuario) {
                return res.status(404).json({ msg: "Usuário não encontrado!" });
                // return res.status(404).redirect('/cadastro');

            }

            res.status(200).json({
                nome: usuario.nome,
                id: usuario.id
            });
        } catch (ex) {
            console.error("Erro ao obter informações do usuário:", ex);
            res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
        }
    }

}