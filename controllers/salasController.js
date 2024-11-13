import SalaEntity from "../entities/salaEntity.js";
import SalaRepository from "../repositories/salaRepository.js";
import ParticipanteRepository from "../repositories/participanteRepository.js";

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
            let { idUsuario, nome, salaId } = req.body;

            if (!idUsuario || !nome || !salaId) {
                return res.status(400).json({ msg: "Parâmetros inválidos!" });
            }

    
            let repo = new SalaRepository();
            let sala = await repo.buscarPorId(salaId); 
            if (!sala) {
                return res.status(404).json({ msg: "Sala não encontrada!" });
            }

            // Verifica a quantidade de participantes
            let repoParticipante = new ParticipanteRepository();
            let participantes = await repoParticipante.listarParticipantes(salaId); 
            // console.log('participantes.length:', participantes.length);
            // if (participantes.length >= 4) {
            //     return res.status(400).json({ msg: "Sala cheia!" });
            // }

            //let participanteAtual = await repoParticipante.buscarPorIdESala(salaId, idUsuario); 
         // if (participanteAtual) {
            //return res.status(200).json({ msg: `Jogador ${nome} já esta na sala!` });            // }

            // Adicionar o jogador à sala
            let result = await repoParticipante.adicionarParticipante(salaId, idUsuario); 
            if (result) {
                res.status(200).json({ msg: `Jogador ${nome} entrou na sala com sucesso!` });
            } else {
                res.status(500).json({ msg: "Erro ao adicionar jogador na sala!" });
            }
        }
        catch (ex) {
            res.status(500).json({ msg: ex.message });
        }
    }


    async validarSala(req, res) {
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

    async remover(idUsuario, salaId) {
        try {
            if (!idUsuario || !salaId) {
                throw new Error("Parâmetros inválidos!");
            }
    
            let repo = new ParticipanteRepository();
            let result = await repo.removerParticipante(salaId, idUsuario); 
            if (result) {
                return { status: 200, msg: `Jogador removido da sala com sucesso!` };
            } else {
                return { status: 500, msg: "Erro ao remover jogador da sala!" };
            }
        } catch (ex) {
            return { status: 500, msg: ex.message };
        }
    }

}