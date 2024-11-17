import express from 'express'
import MaoController from '../controllers/maoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new MaoController();

let auth = new AuthMiddleware();

router.post('/', (req,res) =>{
    ctrl.iniciar(req,res);
});

router.patch('/:maoId/trucar', (req,res) =>{
    ctrl.trucar(req,res);
});

router.patch('/:maoId/finalizar', (req,res) =>{
    ctrl.finalizar(req,res);
});

export default router;