import express from 'express';
import salasController from '../controllers/salasController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new salasController();

let auth = new AuthMiddleware(); 

router.get("/", auth.validar, (req, res) => {
    ctrl.listar(req, res);
});

router.get("/:sal_id/equipes", auth.validar, (req, res) => {
    ctrl.listarEquipes(req, res);
});

router.post("/", auth.validar ,(req, res) => {
    ctrl.criar(req, res);
});

router.post("/adicionar", auth.validar ,(req, res) => {
    ctrl.adicionar(req, res);
});

router.post("/validar", auth.validar ,(req, res) => {
    ctrl.validarSala(req, res);
});

export default router;