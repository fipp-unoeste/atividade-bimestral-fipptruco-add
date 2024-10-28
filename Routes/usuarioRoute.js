import express from 'express';
import UsuarioController from '../controllers/usuarioController.js';

const router = express.Router();
const ctrl = new UsuarioController(); 

router.post("/login", (req, res) => {
    ctrl.buscarUsuario(req, res);
});

router.post("/", (req, res) => {
    ctrl.gravar(req, res);
});

export default router;
