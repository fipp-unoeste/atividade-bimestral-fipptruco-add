import express from 'express';
import salasController from '../controllers/salasController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new salasController();

let auth = new AuthMiddleware(); 

router.get("/", auth.validar, (req, res) => {
    ctrl.listar(req, res);
       //#swagger.tags = ['Salas'] 
   //#swagger.summary = 'Endpoint para exibir a lista de salas'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.get("/:sal_id/equipes", auth.validar, (req, res) => {
    ctrl.listarEquipes(req, res);
       //#swagger.tags = ['Salas'] 
   //#swagger.summary = 'Endpoint para exibir as equipes por sala'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.post("/", auth.validar ,(req, res) => {
    ctrl.criar(req, res);
   //#swagger.tags = ['Salas'] 
   //#swagger.summary = 'Endpoint para criar uma nova sala'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.post("/adicionar", auth.validar ,(req, res) => {
    ctrl.adicionar(req, res);
       //#swagger.tags = ['Salas'] 
   //#swagger.summary = 'Endpoint para adicionar participante na sala'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

router.post("/validar", auth.validar ,(req, res) => {
    ctrl.validarSala(req, res);
   //#swagger.tags = ['Salas'] 
   //#swagger.summary = 'Endpoint para validar a quantidade de participantes na sala'
   /* #swagger.security = [{
        "bearerAuth": []
    }]*/
});

export default router;