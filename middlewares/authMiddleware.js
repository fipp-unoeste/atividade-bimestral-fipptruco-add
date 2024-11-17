
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/usuarioRepository.js';

const SEGREDO = "chave_secreta"; 

export default class AuthMiddleware {

    gerarToken(id, email) {
        return jwt.sign({ id, email }, SEGREDO, { expiresIn: '1h' });
      }

    async validar(req, res, next) {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1]; 
        if(token){
            try {
                let objUsuario = jwt.verify(token, SEGREDO);
                let repo = new UsuarioRepository();
                let usuario = await repo.obter(objUsuario.id);
                if(usuario) {
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
