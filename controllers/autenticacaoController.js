import AuthMiddleware from "../middlewares/authMiddleware.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";

export default class AutenticacaoController {

    async token(req, res) {
        try {
            let {email, senha} = req.body;

            if(email && senha) {
                let repo = new UsuarioRepository();
                let usuario = await repo.validarAcesso(email, senha);
                if(usuario) {
                    let auth = new AuthMiddleware();
                    let token = auth.gerarToken(usuario.id, usuario.nome, usuario.email);

                    res.cookie("token", token, {
                        httpOnly: true
                    })

                    res.status(200).json({token: token});
                }
                else {
                    res.status(404).json({msg: "Credenciais inválidas!"});
                }
            }
            else{
                res.status(400).json({msg: "As credenciais não foram fornecidas corretamente!"})
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }
}