import express from 'express'
import CartaController from '../controllers/cartaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new CartaController();

let auth = new AuthMiddleware();

router.post('/vira', (req,res) =>{
    ctrl.registrarVira(req,res);
});

router.post('/distribuir', (req,res) =>{
    ctrl.distribuirParaParticipante(req,res);
});

export default router;