import express from 'express'
import BaralhoController from '../controllers/baralhoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new BaralhoController();

let auth = new AuthMiddleware();

router.get('/', (req,res) =>{
    ctrl.novaMao(req,res);
    //#swagger.tags = ['API externa - Baralho'] 
    //#swagger.summary = '???? rota removida - não é mais responsável pela requisição de um novo baralho ???'
    /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.get('/distribuir', (req, res) =>{
    ctrl.distribuirCartas(req,res);
    //#swagger.tags = ['API externa - Baralho'] 
    //#swagger.summary = 'Endpoint para distribuição entre os participantes das cartas da mão de baralho gerada'
    /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.get('/virar', (req, res) =>{
    ctrl.virarCarta(req,res);
    //#swagger.tags = ['API externa - Baralho'] 
     //#swagger.summary = 'Endpoint que realiza a virada de carta para determinar a manilha da mão'
/* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

export default router;