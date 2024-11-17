import express from 'express'
import RodadaController from '../controllers/rodadaController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new RodadaController();

let auth = new AuthMiddleware();

router.post('/', (req,res) =>{
    ctrl.iniciar(req,res);
   //#swagger.tags = ['Rodada'] 
   //#swagger.summary = 'Endpoint para inicar a gravação de uma nova rodada'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.patch('/:rodadaId/finalizar', (req,res) =>{
    ctrl.finalizar(req,res);
   //#swagger.tags = ['Rodada'] 
   //#swagger.summary = 'Endpoint para finalizar a atualizar a tabela rodada'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/

});

export default router;