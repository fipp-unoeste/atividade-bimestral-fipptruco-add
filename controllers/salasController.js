import SalaEntity from "../entities/salaEntity.js";
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

    async criar(req, res) {
        try{
            let {nome} = req.body;
            if(nome) {

                let entidade = new SalaEntity(
                    0, 
                    nome
                );

                let repo = new SalaRepository();
                let result = await repo.criar(entidade);
                if(result) {
                    res.status(201).json({msg: "Sala criada!"});
                }
                else {            
                    throw new Error("Erro ao criar sala no banco de dados");
                }
            }
            else{
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(ex) {
            if(ex.insertImovel) {
                res.status(200).json({msg: ex.message});
            }
            else{
                res.status(500).json({msg: ex.message});
            }
        }
    }

    async atualizar(req, res) {
        try{
            let {sal_id, nome } = req.body;
            if(sal_id && nome ) {
                
                let repo = new SalaRepository();
                if(await repo.obter(sal_id)) {
                    let entidade = new SalaEntity(sal_id, nome);

                    let result = await repo.atualizar(entidade);

                    if(result)
                        res.status(200).json({msg: "Nome da Sala atualizado com sucesso!"});
                    else
                        throw new Error("Erro ao atualizar nome da sala no banco de dados");
                }
                else{
                    res.status(404).json({msg: "Nenhuma sala encontrada para alteração!"});
                }
            }
            else{
                res.status(400).json({msg: "Parâmetros inválidos"});
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }
}