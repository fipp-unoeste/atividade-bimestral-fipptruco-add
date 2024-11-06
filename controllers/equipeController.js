import EquipeRepository from "../repositories/equipeRepository.js";
import EquipeEntity from "../entities/equipeEntity.js";

export default class EquipeController {

    async listar(req, res) {
        try {
            const repo = new EquipeRepository(req.db);
            const equipes = await repo.listar();

            if (equipes && equipes.length > 0) {
                return res.status(200).json(equipes);
            } else {
                return res.status(404).json({ msg: "Nenhuma equipe encontrada." });
            }
        } catch (error) {
            console.error("Erro ao listar equipes:", error);
            return res.status(500).json({ msg: "Erro interno do servidor." });
        }
    }

    async gravar(req, res) {
        try {
            const { eqp_descricao } = req.body;

            if (!eqp_descricao) {
                return res.status(400).json({ msg: "Descrição da equipe não informada!" });
            }

            const equipe = new EquipeEntity(0, eqp_descricao);
            const repo = new EquipeRepository(req.db);
            const id = await repo.gravar(equipe);

            return res.status(201).json({ msg: "Equipe cadastrada com sucesso!", eqp_id: id });
        } catch (error) {
            console.error("Erro ao gravar equipe:", error);
            return res.status(500).json({ msg: "Erro interno ao cadastrar equipe." });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { eqp_id } = req.params;
            const repo = new EquipeRepository(req.db);
            const equipe = await repo.buscarPorId(eqp_id);

            if (equipe) {
                return res.status(200).json(equipe);
            } else {
                return res.status(404).json({ msg: "Equipe não encontrada." });
            }
        } catch (error) {
            console.error("Erro ao buscar equipe:", error);
            return res.status(500).json({ msg: "Erro interno ao buscar equipe." });
        }
    }
}
