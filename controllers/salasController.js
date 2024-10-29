import salaEntity from "../entities/salaEntity.js";
import SalaRepository from "../repositories/salaRepository.js";

export default class SalasController {

    async listar(req, res) {
        try{
            let salas = new SalaRepository();
            let lista = await salas.listar();
            res.status(200).json(lista);
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }
}