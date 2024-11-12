import ParticipanteRepository from "../repositories/participanteRepository.js";
import ParticipanteEntity from "../entities/participanteEntity.js";
import SalaRepository from "../repositories/salaRepository.js";
import EquipeRepository from "../repositories/equipeRepository.js";
import UsuarioRepository from "../repositories/usuarioRepository.js";

export default class ParticipanteController {

    // async gravar(req, res) {
    //     try {
    //         const { usu_id, sal_id, eqp_id } = req.body;
    //         if (!usu_id || !sal_id || !eqp_id) {
    //             return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
    //         }

    //         const salaRepo = new SalaRepository();
    //         const sala = await salaRepo.buscarPorId(sal_id);
    //         if (!sala) {
    //             return res.status(404).json({ msg: "Sala não encontrada!" });
    //         }

    //         const equipeRepo = new EquipeRepository();
    //         const equipe = await equipeRepo.buscarPorId(eqp_id);
    //         if (!equipe) {
    //             return res.status(404).json({ msg: "Equipe não encontrada!" });
    //         }

    //         // const entrada = new Date(); 
    //         const entrada = new Date(inputDate); // inputDate é a data recebida, precisa ser uma string válida ou um objeto Date
    //         console.log("Data de entrada:", entrada);

    //         const formattedDate = entrada.toISOString().slice(0, 19).replace('T', ' '); // Formato 'YYYY-MM-DD HH:MM:SS'
    //         console.log("Data formatada:", formattedDate);
            

    //         const participante = new ParticipanteEntity(0, entrada, null, usu_id, sal_id, eqp_id);
    //         console.log("Participante a ser inserido:", participante);


    //         const participanteRepo = new ParticipanteRepository();
    //         const result = await participanteRepo.gravar(participante);

    //         if (result) {
    //             return res.status(201).json({ msg: "Usuário cadastrado como participante com sucesso!" });
    //         } else {
    //             throw new Error("Erro ao cadastrar participante no banco de dados");
    //         }
    //     } catch (ex) {
    //         console.error("Erro ao cadastrar participante:", ex);
    //         return res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
    //     }
    // }

    async buscarOutrosPorSala(req, res) {
        try {
            const { sal_id, usu_id } = req.params;
            const usuarioRepo = new UsuarioRepository();
            const usuario = await usuarioRepo.buscarOutrosPorSala(sal_id, usu_id);

            if (usuario.length === 0) {
                return res.status(404).json({ msg: "Nenhum participante encontrado para esta sala." });
            }

            res.status(200).json(usuario);
        } catch (ex) {
            console.error("Erro ao buscar participantes:", ex);
            res.status(500).json({ msg: ex.message });
        }
    }

    // async atualizarSaida(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const saida = new Date(); 

    //         const participanteRepo = new ParticipanteRepository();
    //         const participante = await participanteRepo.buscarPorId(id);

    //         if (!participante) {
    //             return res.status(404).json({ msg: "Participante não encontrado!" });
    //         }

    //         participante.saida = saida;
    //         await participanteRepo.atualizar(participante);

    //         res.status(200).json({ msg: "Participante atualizado com sucesso!" });
    //     } catch (ex) {
    //         console.error("Erro ao atualizar participante:", ex);
    //         res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
    //     }
    // }

    async associarParticipante(req, res) {
        const { entrada, saida, usu_id, sal_id, eqp_id } = req.body;
    
        const salaRepo = new SalaRepository();
        const equipeRepo = new EquipeRepository();
        const participanteRepo = new ParticipanteRepository();
    
        try {
            const salaExiste = await salaRepo.buscarPorId(sal_id);
            if (!salaExiste) {
                return res.status(404).json({ msg: "Sala não encontrada!" });
            }
    
            const equipeExiste = await equipeRepo.buscarPorId(eqp_id);
            if (!equipeExiste) {
                return res.status(404).json({ msg: "Equipe não encontrada!" });
            }
    
            const participante = new ParticipanteEntity(0, entrada, saida, usu_id, sal_id, eqp_id);
            const participanteId = await participanteRepo.gravar(participante);
    
            res.status(201).json({ msg: "Participante associado com sucesso!", participanteId });
        } catch (error) {
            console.error("Erro ao associar participante:", error);
            res.status(500).json({ msg: error.message || "Erro interno do servidor" });
        }
    }

    // async listarParticipantes(req, res) {
    //     try {
    //         const { sal_id } = req.params;
    //         const participanteRepo = new ParticipanteRepository();
    //         const participantes = await participanteRepo.listarParticipantes(sal_id);
    
    //         if (participantes.length === 0) {
    //             return res.status(404).json({ msg: "Nenhum participante encontrado para esta sala." });
    //         }
    
    //         res.status(200).json(participantes);
    //     } catch (error) {
    //         console.error("Erro ao listar participantes:", error);
    //         res.status(500).json({ msg: error.message || "Erro interno do servidor" });
    //     }
    // }

    // async adicionarParticipante(req, res) {
    //     try {
    //         const { sal_id, usu_id } = req.body;
    //         const participanteRepo = new ParticipanteRepository();
    //         const result = await participanteRepo.adicionarParticipante(sal_id, usu_id);
    
    //         if (result) {
    //             return res.status(201).json({ msg: "Participante adicionado com sucesso!" });
    //         } else {
    //             return res.status(400).json({ msg: "Erro ao adicionar participante." });
    //         }
    //     } catch (error) {
    //         console.error("Erro ao adicionar participante:", error);
    //         res.status(500).json({ msg: error.message || "Erro interno do servidor" });
    //     }
    // }

    // async removerParticipante(req, res) {
    //     try {
    //         const { sal_id, usu_id } = req.body;
    //         const participanteRepo = new ParticipanteRepository();
    //         const result = await participanteRepo.removerParticipante(sal_id, usu_id);
    
    //         if (result) {
    //             return res.status(200).json({ msg: "Participante removido com sucesso!" });
    //         } else {
    //             return res.status(400).json({ msg: "Erro ao remover participante." });
    //         }
    //     } catch (error) {
    //         console.error("Erro ao remover participante:", error);
    //         res.status(500).json({ msg: error.message || "Erro interno do servidor" });
    //     }
    // }
    
    
    
}
