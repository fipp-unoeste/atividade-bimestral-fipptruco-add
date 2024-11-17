import RodadaRepository from "../repositories/rodadaReposytory.js";
import RodadaEntity from "../entities/rodadaEntity.js";

export default class RodadaController {

    async iniciar(req, res) {
        try {
            const { maoId } = req.body;

            if (!maoId) {
                return res.status(400).json({ msg: "A maoId deve ser informada!" });
            }

            const rodada = new RodadaEntity(0, maoId, null);
            const repo = new RodadaRepository();
            rodada.rodId = await repo.iniciar(rodada);

            return res.status(201).json({ msg: "Rodada cadastrado com sucesso!", rodada });
        } catch (error) {
            console.error("Erro ao gravar rodada:", error);
            return res.status(500).json({ msg: "Erro interno ao cadastrar o Rodada." });
        }
    }

    async finalizar(req, res) {
        try {
            const { rodadaId } = req.params;
            const { equipeId } = req.body;

            if (!rodadaId) {
                return res.status(400).json({ msg: "O id da Rodada deve ser informada!" });
            }
            if (!equipeId) {
                return res.status(400).json({ msg: "EquipeId deve ser informada!" });
            }

            const repo = new RodadaRepository();
            const rodada = await repo.obter(rodadaId);
            if (!rodada) {
                return res.status(400).json({ msg: "Rodada não encontrada!" });
            }

            rodada.eqpVencedora = equipeId;

            await repo.atualizar(rodada);
            return res.status(201).json({ msg: "Rodada terminada com sucesso!", rodada });
        } catch (error) {
            console.error("Erro ao terminar Rodada:", error);
            return res.status(500).json({ msg: "Erro interno ao terminar o Rodada." });
        }
    }
}
