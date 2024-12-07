import express from 'express';
import ParticipanteController from '../controllers/participanteController.js';

const router = express.Router();
const ctrl = new ParticipanteController();

router.post("/associar", (req, res) => {
    ctrl.associarParticipante(req, res);
   //#swagger.tags = ['Participantes'] 
   //#swagger.summary = 'Endpoint para associar participantes'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.get("/por_sala/:sal_id", (req, res) => {
    ctrl.buscarPorSala(req, res);
   //#swagger.tags = ['Participantes'] 
   //#swagger.summary = 'Endpoint para buscar participantes nas salas'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
})

router.get("/outros_por_sala/:sal_id/:usu_id", (req, res) => {
    ctrl.buscarOutrosPorSala(req, res);
   //#swagger.tags = ['Participantes'] 
   //#swagger.summary = 'Endpoint para buscar participantes nas salas'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});
export default router;
