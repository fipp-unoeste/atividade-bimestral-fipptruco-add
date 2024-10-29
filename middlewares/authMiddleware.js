
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/usuarioRepository.js';

const SEGREDO = "chave_secreta"; 

export default class AuthMiddleware {

    gerarToken(id, email, senha) {
        return jwt.sign({
            id,
            email,
            senha,
        }, SEGREDO, { expiresIn: '1h' }); 
    }

    async validar(req, res, next) {
        let {token} = req.cookies;
        if(token){
            try {
                let objUsuario = jwt.verify(token, SEGREDO);
                let repo = new UsuarioRepository();
                let usuario = await repo.obter(objUsuario.id);
                if(usuario) {
                    let auth = new AuthMiddleware();
                    let tokenNovo = auth.gerarToken(objUsuario.id, objUsuario.email, objUsuario.senha)
                    res.cookie("token", tokenNovo, {
                        httpOnly:true
                    })
                    req.usuarioLogado = usuario;
                    next();
                }
                else{
                    res.status(401).json({msg: "Não autorizado!"});
                }
            }
            catch(ex) {
                res.status(401).json({msg: "Não autorizado!"});
            }
        }
        else{
            res.status(401).json({msg: "Não autorizado!"});
        }
    }
}
