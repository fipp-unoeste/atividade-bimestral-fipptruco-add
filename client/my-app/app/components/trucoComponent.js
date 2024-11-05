import { useEffect, useState } from "react";

const TrucoComponents = () => {
    const [conexaoWebSocket, setConexaoWebSocket] = useState(null);
    const [estadoJogo, setEstadoJogo] = useState({
        pontuacao: [0, 0],       // Pontuação das duas equipes (cada equipe com dois jogadores)
        jogadas: [],             // Histórico das jogadas
        jogadores: ["Jogador 1", "Jogador 2", "Jogador 3", "Jogador 4"] // Nomes dos jogadores
    });
    const URL_SERVIDOR = 'ws://localhost:5000'; // URL do servidor WebSocket

    // Função para atualizar o estado do jogo com os eventos recebidos pelo WebSocket
    const atualizarEstadoJogo = (dados) => {
        switch (dados.tipo) {
            case "jogada":
                setEstadoJogo((prev) => ({
                    ...prev,
                    jogadas: [...prev.jogadas, dados.jogada] // Armazena a jogada
                }));
                break;
            case "pontuacao":
                setEstadoJogo((prev) => ({
                    ...prev,
                    pontuacao: dados.pontuacao // Atualiza a pontuação das equipes
                }));
                break;
            default:
                console.warn("Evento desconhecido", dados);
        }
    };

    // Configuração do WebSocket na montagem do componente
    useEffect(() => {
        const socket = new WebSocket(URL_SERVIDOR);
        setConexaoWebSocket(socket);

        // Receber mensagens do WebSocket e atualizar o estado do jogo
        socket.onmessage = (evento) => {
            const dados = JSON.parse(evento.data);
            atualizarEstadoJogo(dados);
        };

        socket.onclose = () => console.log("WebSocket desconectado");

        // Fechar a conexão quando o componente desmontar
        return () => socket.close();
    }, []);

    // Função para enviar uma jogada de um jogador específico pelo WebSocket
    const enviarJogada = (indiceJogador, acao) => {
        if (conexaoWebSocket) {
            conexaoWebSocket.send(JSON.stringify({ 
                tipo: "jogada", 
                jogador: estadoJogo.jogadores[indiceJogador], 
                acao 
            }));
        }
    };

    return (
        <div>
            <h1>Truco - Pontuação das Equipes</h1>
            <p>Equipe 1: {estadoJogo.pontuacao[0]} pontos | Equipe 2: {estadoJogo.pontuacao[1]} pontos</p>
            
            <h2>Histórico de Jogadas</h2>
            <ul>
                {estadoJogo.jogadas.map((jogada, indice) => (
                    <li key={indice}>{jogada.jogador} fez {jogada.acao}</li>
                ))}
            </ul>

            <h2>Ações dos Jogadores</h2>
            {/* Botões para simular ações de cada jogador */}
            {estadoJogo.jogadores.map((jogador, indice) => (
                <div key={indice}>
                    <h3>{jogador}</h3>
                    <button onClick={() => enviarJogada(indice, "Pedir Truco")}>Pedir Truco</button>
                    <button onClick={() => enviarJogada(indice, "Aceitar Truco")}>Aceitar Truco</button>
                    <button onClick={() => enviarJogada(indice, "Jogar Carta")}>Jogar Carta</button>
                </div>
            ))}
        </div>
    );
};

export default TrucoComponents;
