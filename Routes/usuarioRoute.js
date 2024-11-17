import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new UsuarioController();
let auth = new AuthMiddleware(); 

router.post("/login", (req, res) => {
   //#swagger.tags = ['Usuários'] 
   //#swagger.summary = 'Endpoint para realizar loggin do usuário'
    ctrl.buscarUsuario(req, res);
});

router.post("/", (req, res) => {
    //#swagger.tags = ['Usuários'] 
    //#swagger.summary = 'Endpoint para cadastrar novo usuário'
    ctrl.gravar(req, res);
});

router.get('/info', auth.validar, (req,res) => {
       //#swagger.tags = ['Usuários'] 
   //#swagger.summary = 'Endpoint para validação do usuário'
    ctrl.info(req,res);
});


export default router;
