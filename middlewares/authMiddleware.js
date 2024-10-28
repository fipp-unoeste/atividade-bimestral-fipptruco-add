// authMiddleware.js
import jwt from 'jsonwebtoken';
import UsuarioRepository from '../repositories/usuarioRepository.js';

const SEGREDO = "chave_secreta"; 

export default class AuthMiddleware {
    gerarToken(id, nome, email) {
        return jwt.sign({
            id,
            nome,
            email,
        }, SEGREDO, { expiresIn: '1h' }); 
    }

    async validar(req, res, next) {
        const { token } = req.cookies;
        if (token) {
            try {
                const objUsuario = jwt.verify(token, SEGREDO);
                const repo = new UsuarioRepository();
                const usuario = await repo.obter(objUsuario.id);
                if (usuario) {
                    req.usuarioLogado = usuario;
                    next();
                } else {
                    res.status(401).json({ msg: "Não autorizado!" });
                }
            } catch (ex) {
                res.status(401).json({ msg: "Token inválido!" });
            }
        } else {
            res.status(401).json({ msg: "Não autorizado!" });
        }
    }
}
