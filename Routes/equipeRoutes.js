import express from "express";
import EquipeController from "../controllers/equipeController.js";
import AuthMiddleware from "../middlewares/authMiddleware.js"; 

const router = express.Router();
const ctrl = new EquipeController();
let auth = new AuthMiddleware(); 

router.get('/', auth.validar, (req,res) => {
    ctrl.listar(req,res);
});

router.post("/", auth.validar, (req,res) => {
   ctrl.gravar(req,res) ;
});

router.get("/:eqp_id",auth.validar, (req,res) => {
    ctrl.buscarPorId(req,res);
});

export default router;
