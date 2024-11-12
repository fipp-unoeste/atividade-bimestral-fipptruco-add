import express from 'express';
import ParticipanteController from '../controllers/participanteController.js';

const router = express.Router();
const ctrl = new ParticipanteController();

router.post("/associar", (req, res) => {
    ctrl.associarParticipante(req, res);
});

router.get("/outros_por_sala/:sal_id/:usu_id", (req, res) => {
    ctrl.buscarOutrosPorSala(req, res);
});
export default router;
