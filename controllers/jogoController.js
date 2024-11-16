import JogoRepository from "../repositories/jogoRepository.js";
import JogoEntity from "../entities/jogoEntity.js";

export default class JogoController {

    async iniciar(req, res) {
        try {
            const { salaId } = req.body;

            if (!salaId) {
                return res.status(400).json({ msg: "A sala deve ser informada!" });
            }

            const jogo = new JogoEntity(0, new Date(), null, salaId);
            const repo = new JogoRepository();
            jogo.jogoId = await repo.iniciar(jogo);

            return res.status(201).json({ msg: "Jogo cadastrado com sucesso!", jogo });
        } catch (error) {
            console.error("Erro ao gravar equipe:", error);
            return res.status(500).json({ msg: "Erro interno ao cadastrar o jogo." });
        }
    }

    async terminar(req, res) {
        try {
            const { jog_id } = req.params;

            if (!jog_id) {
                return res.status(400).json({ msg: "O id do jogo deve ser informado!" });
            }

            const repo = new JogoRepository();
            const jogo = await repo.obter(jog_id);
            if (!jogo) {
                return res.status(400).json({ msg: "Jogo não encontrado!" });
            }

            jogo.jogoDtFim = new Date();
            await repo.terminar(jogo);

            return res.status(201).json({ msg: "Jogo terminado com sucesso!", jogo });
        } catch (error) {
            console.error("Erro ao terminar jogo:", error);
            return res.status(500).json({ msg: "Erro interno ao terminar o jogo." });
        }
    }

    
}

