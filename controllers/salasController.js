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
            if(ex.insertSala) {
                res.status(200).json({msg: ex.message});
            }
            else{
                res.status(500).json({msg: ex.message});
            }
        }
    }

    adicionar(req, res) {
        // if(usuarios.findIndex(x=> x.nome == req.body.nome && x.sala == req.body.sala) == -1)
        //     usuarios.push({nome: req.body.nome, sala: req.body.sala})

        // let qtde = usuarios.length;

         res.status(200).json({quantidade: 98});
        //  res.status(200).json({qtde: qtde});
    }


    validarSala(req, res) {
        let cheia = usuarios.filter(x=>  x.sala == req.body.sala).length >= 4;
        res.status(200).json({cheia: cheia});
    }

    remover(nome, sala) {
        // usuarios = usuarios.filter(x=> x.nome != nome && x.sala != sala);
    }
}