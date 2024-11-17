import SalaEntity from "../entities/salaEntity.js";
import SalaRepository from "../repositories/salaRepository.js";
import EquipeRepository from "../repositories/equipeRepository.js";
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

    async listarEquipes(req, res) {
        try{
            let { sal_id } = req.params;
            let equipeRepo = new EquipeRepository();
            let lista = await equipeRepo.listarPorSala(sal_id);
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
            let { idUsuario, nome, salaId, eqp_id } = req.body;

            if (!idUsuario || !nome || !salaId || !eqp_id) {
                return res.status(400).json({ ok: false, msg: "Parâmetros inválidos!" });
            }

    
            let repo = new SalaRepository();
            let sala = await repo.buscarPorId(salaId); 
            if (!sala) {
                return res.status(404).json({ ok: false, msg: "Sala não encontrada!" });
            }

            // Verifica a quantidade de participantes
            let repoParticipante = new ParticipanteRepository();
            let participantes = await repoParticipante.listarParticipantes(salaId); 
            if (participantes.length >= 4) {
                 return res.status(400).json({ ok: false, msg: "Sala cheia!" });
            }

            //Verificar se equipe está cheia
            let qtdeNaEquipe = 0;
            for(let i = 0; i < participantes.length; i++){
                if(participantes[i].eqp_id == eqp_id)
                    qtdeNaEquipe++;
            }

            if(qtdeNaEquipe == 2)
                return res.status(400).json({ ok: false, msg: "Equipe cheia!" });

            let participanteAtual = await repoParticipante.buscarPorUsuarioESala(salaId, idUsuario); 
            if (participanteAtual) 
                return res.status(200).json({ ok: true, msg: `Jogador ${nome} já esta na sala!` });            

            // Adicionar o jogador à sala
            let result = await repoParticipante.adicionarParticipante(salaId, idUsuario, eqp_id); 
            if (result) {
                res.status(200).json({ ok: true, msg: `Jogador ${nome} entrou na sala com sucesso!` });
            } else {
                res.status(500).json({ ok: false, msg: "Erro ao adicionar jogador na sala!" });
            }
        }
        catch (ex) {
            res.status(500).json({ ok: false, msg: ex.message });
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