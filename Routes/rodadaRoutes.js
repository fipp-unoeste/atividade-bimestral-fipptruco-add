import express from 'express'
import RodadaController from '../controllers/rodadaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new RodadaController();

let auth = new AuthMiddleware();

router.post('/', (req,res) =>{
    ctrl.iniciar(req,res);
});

router.patch('/:rodadaId/finalizar', (req,res) =>{
    ctrl.finalizar(req,res);
});

export default router;