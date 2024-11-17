import express from 'express'
import JogoController from '../controllers/jogoController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const ctrl = new JogoController();

let auth = new AuthMiddleware();

router.post('/', (req,res) =>{
    ctrl.iniciar(req,res);
});

router.put('/:jog_id', (req, res) =>{
    ctrl.terminar(req,res);
});

export default router;