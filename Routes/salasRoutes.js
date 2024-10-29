import express from 'express';
import salasController from '../controllers/salasController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new salasController();

let auth = new AuthMiddleware(); 

router.get("/", auth.validar, (req, res) => {
    ctrl.listar(req, res);
});

router.post("/", auth.validar ,(req, res) => {
    ctrl.criar(req, res);
});

router.put("/:id", auth.validar, (req, res) => {
    ctrl.atualizar(req, res);
});

export default router;