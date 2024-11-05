import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new UsuarioController();
let auth = new AuthMiddleware(); 

router.post("/login", (req, res) => {
    ctrl.buscarUsuario(req, res);
});

router.post("/", (req, res) => {
    ctrl.gravar(req, res);
});

router.get('/info', auth.validar, (req,res) => {
    ctrl.info(req,res);
});


export default router;
