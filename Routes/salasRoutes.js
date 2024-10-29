import express from 'express';
import salasController from '../controllers/salasController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new salasController();

let auth = new AuthMiddleware(); 

router.get("/", auth.validar, (req, res) => {
    ctrl.listar(req, res);
});

export default router;