import express from 'express'
import MaoController from '../controllers/maoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new MaoController();

let auth = new AuthMiddleware();

router.post('/', (req,res) =>{
    ctrl.iniciar(req,res);
      //#swagger.tags = ['Mão da partida'] 
   //#swagger.summary = 'Endpoint para inicar uma nova mão da partida'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.patch('/:maoId/trucar', (req,res) =>{
    ctrl.trucar(req,res);
    //#swagger.tags = ['Mão da partida'] 
   //#swagger.summary = 'Endpoint para mudar a pontuação da mão através da chamada do TRUCO'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.patch('/:maoId/finalizar', (req,res) =>{
    ctrl.finalizar(req,res);
    //#swagger.tags = ['Mão da partida'] 
   //#swagger.summary = 'Endpoint para finalizar a mão da partida e atualizar a inserção na tabela'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

export default router;