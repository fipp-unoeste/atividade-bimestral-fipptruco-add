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

    async adicionar(req, res) {

        try {
            let { nome, salaId } = req.body;

            if (!nome || !salaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }

    
            let repo = new SalaRepository();
            let sala = await repo.buscarPorId(salaId); 
            if (!sala) {
                return res.status(404).json({ msg: "Sala não encontrada!" });
            }

            // Verifica a quantidade de participantes
            let participantes = await repo.listarParticipantes(salaId); 
            if (participantes.length >= 4) {
                return res.status(400).json({ msg: "Sala cheia!" });
            }

            // Adicionar o jogador à sala
            let result = await repo.adicionarParticipante(salaId, nome); 
            if (result) {
                res.status(200).json({ msg: `Jogador ${nome} entrou na sala com sucesso!` });
            } else {
                res.status(500).json({ msg: "Erro ao adicionar jogador na sala!" });
            }
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }

        // if(usuarios.findIndex(x=> x.nome == req.body.nome && x.sala == req.body.sala) == -1)
        //     usuarios.push({nome: req.body.nome, sala: req.body.sala})
        // let qtde = usuarios.length;
        //  res.status(200).json({qtde: qtde});
    }


    async validarSala(req, res) {
        // let cheia = usuarios.filter(x=>  x.sala == req.body.sala).length >= 4;
        // res.status(200).json({cheia: cheia});

        try {
            let { salaId } = req.body;
            if (!salaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }

            let repo = new SalaRepository();
            let participantes = await repo.listarParticipantes(salaId);

            // Verifica se a sala está cheia
            let cheia = participantes.length >= 4;
            res.status(200).json({ cheia: cheia });
        } catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }

    async remover(nome, sala) {
        // usuarios = usuarios.filter(x=> x.nome != nome && x.sala != sala);
        try {
            let { nome, salaId } = req.body;

            if (!nome || !salaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }

            let repo = new SalaRepository();
            let result = await repo.removerParticipante(salaId, nome); // Método para remover jogador
            if (result) {
                res.status(200).json({ msg: `Jogador ${nome} removido da sala com sucesso!` });
            } else {
                res.status(500).json({ msg: "Erro ao remover jogador da sala!" });
            }
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }
    
}