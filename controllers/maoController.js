import MaoRepository from "../repositories/maoRepository.js";
import MaoEntity from "../entities/maoEntity.js";
import Adapter from "../adapters/adapter.js";

export default class MaoController {

    async iniciar(req, res) {
        try {
            const { ordem, trucada, valor, jogoId, equipeVencedora } = req.body;

            if (!ordem || !trucada || !valor || !jogoId) {
                return res.status(400).json({ msg: "Todos os parametros devem ser informados: ordem, trucada, valor, jogoId!" });
            }

            const mao = new MaoEntity(0, ordem, null, trucada, valor, jogoId, equipeVencedora);
            const adapter = new Adapter();

            const deck = await adapter.novoDeck();
            mao.maoCodigoBaralho = deck.deck_id;

            const repo = new MaoRepository();
            mao.maoId = await repo.iniciar(mao);

            return res.status(201).json({ msg: "Mao cadastrado com sucesso!", mao});
        } catch (error) {
            console.error("Erro ao gravar Mao:", error);
            return res.status(500).json({ msg: "Erro interno ao cadastrar o Mao." });
        }
    }


    async trucar(req, res) {
        try {
            const { maoId } = req.params;

            if (!maoId) {
                return res.status(400).json({ msg: "MaoId deve ser informado!" });
            }

            const repo = new MaoRepository();
            const mao = await repo.obter(maoId);
            if (!mao) {
                return res.status(400).json({ msg: "Mao inexistente!" });
            }

            mao.maoTrucada = 'S';
            mao.maoValor = 3;

            await repo.atualizar(mao);

            return res.status(201).json({ msg: "Mao Trucada atualizada com sucesso!", mao});
        } catch (error) {
            console.error("Erro ao atualizar Mao trucada:", error);
            return res.status(500).json({ msg: "Erro interno ao atualizar Mao Trucada." });
        }
    }

    async finalizar(req, res) {
        try
        {
            const { maoId } = req.params;
            const { equipeId } = req.body;

            if (!maoId) {
                return res.status(400).json({ msg: "MaoId deve ser informado!" });
            }
            if (!equipeId) {
                return res.status(400).json({ msg: "EquipeId deve ser informado!" });
            }

            const repo = new MaoRepository();
            const mao = await repo.obter(maoId);
            if (!mao) {
                return res.status(400).json({ msg: "Mao inexistente!" });
            }

            mao.eqpVencedora = equipeId;

            await repo.atualizar(mao);

            return res.status(201).json({ msg: "Mao finalizada com sucesso com a equipe vencedora!", mao});
        } catch (error) {
            console.error("Erro ao finalizar Mao:", error);
            return res.status(500).json({ msg: "Erro interno ao finalizar Mao." });
        }
    }
}
