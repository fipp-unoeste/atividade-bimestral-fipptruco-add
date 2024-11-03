import express from 'express'
import BaralhoController from '../controllers/baralhoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new BaralhoController();

let auth = new AuthMiddleware();

router.get('/', (req,res) =>{
    ctrl.novaMao(req,res);
});

router.get('/distribuir', (req, res) =>{
    ctrl.distribuirCartas(req,res);
});

router.get('/virar', (req, res) =>{
    ctrl.virarCarta(req,res);
});

export default router;