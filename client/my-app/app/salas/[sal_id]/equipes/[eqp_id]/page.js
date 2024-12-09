'use client'
import { useState, useEffect} from "react";
import {  useParams, useRouter } from 'next/navigation';
import { getSocket, disconnectSocket } from "@/app/libs/socket";
import useSocketEvent from '@/app/hooks/useSocketEvent';


export default function Sala() {
    const params = useParams(); 
    const { sal_id, eqp_id } = params; 
    const URL = 'http://localhost:5000';
    const router = useRouter();
    const [eventos, setEventos] = useState([]);
    const [nomeJogador, setNomeJogador] = useState(''); 
    const [idJogador, setIdJogador] = useState(''); 
    const [jogadores, setJogadores] = useState([]);
    const [maos, setMaos] = useState([]);
    const [maoAtual, setMaoAtual] = useState({});
    const [rodadaEncerrada, setRodadaEncerrada] = useState(false);
    const [equipeVencedoraId, setEquipeVencedoraId] = useState('');
    const [maoEncerrada, setMaoEncerrada] = useState(false);
    const [pontosEquipe1, setPontosEquipe1] = useState(0);
    const [pontosEquipe2, setPontosEquipe2] = useState(0);

    const posicoesEquipe1 = [
        { top: '20%', left: '50%' },
        { bottom: '0%', left: '50%' },
    ];
    
    const posicoesEquipe2 = [
        { top: '50%', left: '3%' },
        { top: '50%', right: '0%' },
    ];

    useSocketEvent('setup', (command) => {
        console.log('Recebendo o evento setup');
        setJogadores(Object.values(command.jogadores));
    });

    useSocketEvent('add-player', (command) => {
        console.log('Recebendo o evento add-player');
        setEventos((prev) => [...prev, `${command.jogador.nome} entrou na sala`]);
        setJogadores((prev) => [...prev, command.jogador]);
    });

    useSocketEvent('player-disconnected', (command) => {
        console.log('Recebendo o evento player-disconnected');
        setEventos((prev) => [...prev, `${command.jogador.nome} saiu da sala`]);
        setJogadores((prev) => prev.filter((jogador) => jogador.id !== command.jogador.id));
    });

    useSocketEvent('nova-mao', (command) => {
        console.log('Recebendo o evento nova-mao');
        setEventos((prev) => [...prev, `Nova mão iniciada`]);
        setJogadores(Object.values(command.jogadores));
        //setMaos((prev) => [...prev, command.mao]);
        setMaoAtual(command.mao);

        if(command.maoAnterior) {
            const equipeVencedoraId = command.maoAnterior.equipeVencedoraId;
            setEventos((prev) => [...prev,`Equipe vencedora da Mão Anterior:` + command.equipeVencedoraId]);
        }
    });

    useSocketEvent('jogada', (command) => {
        console.log('Recebendo o evento jogada');
        setMaoAtual(command.mao);
        setJogadores(Object.values(command.jogadores));
        setRodadaEncerrada(command.rodadaEncerrada);
        setEquipeVencedoraId(command.equipeVencedoraId);
        if(command.rodadaEncerrada) {
            setEventos((prev) => [...prev,'Equipe vencedora da Rodada: '+ command.equipeVencedoraId]);
        }
    });

    useSocketEvent('rodada-encerrada', (command) => {
        console.log('Recebendo o evento rodada-encerrada');
        setEventos((prev) => [...prev, `Rodada encerrada`]);
        setMaoAtual(command.mao);
        setMaoEncerrada(command.maoEncerrada);        
        // if(command.maoEncerrada) {
        //     setEventos((prev) => [...prev,'Equipe vencedora da Mão: '+ command.equipeVencedoraId]);
        //     // getSocket().emit('encerrar-mao');
        // }
        setRodadaEncerrada(false); // Reseta o estado
    });

    useSocketEvent('encerrar-mao', (command) => {
        console.log('Recebendo o evento encerrar-mao');
        setMaoAtual(command.mao);

        if (command.equipeVencedoraId == 1) {
            setPontosEquipe1((prev) => prev + command.mao.valor || 0);
        } else if (command.equipeVencedoraId == 2) {
            setPontosEquipe2((prev) => prev + command.mao.valor || 0);
        }
        setMaoEncerrada(false); // Reseta o estado

        if(command.jogoEncerrado) {
            setEventos((prev) => [...prev,'Jogo Encerrado']);
            setEventos((prev) => [...prev,'Equipe vencedora do Jogo: '+ command.equipeVencedoraId]);
        }else{
            getSocket().emit('nova-mao');
        }
    });


    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function sair() {
        disconnectSocket();
        router.push('/salas');
    }

    function renderizarCartas(jogador) {
        const temCartas = Object.keys(maoAtual).length > 0;
        const renderizarCartasFrente = jogador.id == idJogador;
        return (
            temCartas && (
                renderizarCartasFrente ? (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {jogador.cartas.map((carta, index) => (
                            <img 
                                key={index} 
                                src={carta.image} 
                                alt="Cartas Truco" 
                                style={styles.cartas}
                                onClick={() => getSocket().emit('jogada', { carta })} 
                            />
                        ))}
                    </div>  
                ) :
                (
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                        {jogador.cartas.map((carta, index) => (
                            <img 
                                key={index} 
                                src='https://deckofcardsapi.com/static/img/back.png' 
                                alt="Cartas Truco" 
                                style={styles.cartas} 
                            />
                        ))}
                    </div>  
                )
            )
            
        );
    }

    function renderizarCartasMovimentacao() {
        return (
            <div name="movimentacoes" style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '10px' }}>
                {maoAtual.movimentacoes && maoAtual.movimentacoes.filter((movimentacao) => movimentacao.tipo == 'jogada').map((movimentacao, index) => (
                    <div key={index} style={{ textAlign: 'center' }}>
                        <p>{movimentacao.jogador.nome}</p>
                        <img 
                            src={movimentacao.carta.image}
                            alt="Cartas Truco jogadas" 
                            style={styles.cartas} 
                        /> 
                    </div>
                ))}

            </div>
        )
    }

    // function encerrarRodada() {
    //     const socket = getSocket();
    //     socket.emit('encerrar-rodada', { equipeVencedoraId: equipeVencedoraId });
    //     setRodadaEncerrada(false); // Reseta o estado
    // }

    // function encerrarMao() {
    //     const socket = getSocket();
    //     socket.emit('mao-encerrada', { equipeVencedoraId: equipeVencedoraId });
    //     setRodadaEncerrada(false); // Reseta o estado
    // }

    useEffect(() => {
        const token = getCookie('token');

        fetch(URL + '/usuarios/info', {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
        .then(r => {
            if (!r.ok) {
                console.log('r:', r);
                throw new Error('Erro ao buscar informações do jogador');
            }
            return r.json();
        })
        .then(data => {
            if (data.nome) {
                const socket = getSocket();
                socket.emit('add-player',{id: data.id, nome: data.nome, sal_id: sal_id, eqp_id: eqp_id});
                setNomeJogador(data.nome);
                setIdJogador(data.id);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
    }, [sal_id, eqp_id, URL]);

    return (
        <div style={styles.jogoContainer}>
            <div style={styles.mesaJogo}>
                {jogadores.filter((jogador) => jogador.eqp_id != 2).map((jogador, index) => (
                    <div key={index} style={{ ...styles.jogadorEquipe1, ...posicoesEquipe1[index] }}>
                        <h3>{jogador.nome} {jogador.id == idJogador ? ' (Você)' : ''}</h3>
                        <div style={styles.containerCartas}>
                            {renderizarCartas(jogador)}
                        </div>
                    </div> 
                ))}
                
                {jogadores.filter((jogador) => jogador.eqp_id != 1).map((jogador, index) => (
                    <div key={index} style={{ ...styles.jogadorEquipe2, ...posicoesEquipe2[index] }}>
                        <h3>{jogador.nome} {jogador.id == idJogador ? ' (Você)' : ''}</h3>
                        <div style={styles.containerCartas}>
                            {renderizarCartas(jogador)}
                        </div>
                    </div> 
                ))}
                
                <div style={styles.mesa}>
                    {renderizarCartasMovimentacao()}
                    <h3>Vira</h3>
                    {/* <img src="https://deckofcardsapi.com/static/img/QH.png" alt="Cartas Truco" style={styles.cartaVerso} /> */}
                    {maoAtual.vira == null ? '' : <img src={maoAtual.vira.image} alt="Cartas Truco" style={styles.cartaVerso} />}
                </div>
            </div>
            <div style={styles.pontuacao}>
                <h3 style={styles.tituloPontuacao}>Pontuação</h3>
                <div style={styles.equipe}>
                    <p style={styles.nomeEquipe}>Equipe 1</p>
                    <p style={styles.valorPontuacao}>{pontosEquipe1}</p>
                </div>
                <div style={styles.divisor}></div> {/* Divisor entre as equipes */}
                <div style={styles.equipe}>
                    <p style={styles.nomeEquipe}>Equipe 2</p>
                    <p style={styles.valorPontuacao}>{pontosEquipe2}</p>
                </div>
            </div>

            <div style={styles.menuLateral}>
                <div style={styles.botaoContainer}>
                    <h2 style={styles.menuLateralTitle}>Jogadores na Sala</h2>
                </div>
                <br />
                {eventos.map((evento, index) => (
                    <p key={index}>{evento}</p>
                ))}

                <br />
                <br />

                <div style={styles.botaoContainer}>
                    <button style={styles.buttonTruco} onClick={() => getSocket().emit("teste", { codSala: sal_id })}>Pedir truco</button>
                </div>
                <div style={styles.botaoContainer}>
                    {jogadores.length == 4 && (
                        <button style={styles.buttonIniciarJogo} onClick={() => getSocket().emit("nova-mao", { sal_id: sal_id })}>Iniciar Jogo</button>
                    )}
                    
                </div>

                {/* testando rodada encerrada */}
                <div style={styles.botaoContainer}>
                    {rodadaEncerrada && (
                        <button style={styles.buttonEncerrarRodada} onClick={() => getSocket().emit("encerrar-rodada", { sal_id: sal_id })}>Encerrar rodada</button>
                    )}
                </div>

                {/* testando mao encerrada */}
                <div style={styles.botaoContainer}>
                    {maoEncerrada && (
                        <button style={styles.buttonEncerrarMao} onClick={() => getSocket().emit("encerrar-mao", { sal_id: sal_id })}>Encerrar mão</button>
                    )}
                </div>
            </div>
            <button style={styles.buttonSair} className="button-sair" onClick={sair}>Sair do Jogo</button>

            {/* testando msg de vencedor */}
            <div style={styles.quadroVencedor} id="quadroVencedor">
                {equipeVencedoraId && (
                    <div>
                        <h2>Equipe {equipeVencedoraId} venceu</h2>
                        <button style={styles.botaoVoltar} onClick={() => voltarParaSalas()}>
                            Voltar para Salas
                        </button>
                    </div>
                )}
            </div>

        </div>
    );

}

const styles = {
    jogoContainer: {
        display: 'flex',
        height: '100vh',
    },

    mesaJogo: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#004d00', 
    },

    mesa: {
        position: 'absolute',
        backgroundColor: '#004d00', /* Cor da mesa */
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },

    jogadorEquipe1: {
        position: 'absolute',
        backgroundColor: '#FF0000', /* Cor dos jogadores */
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        margin: '5px 10px 5px 10px',
    },

    jogadorEquipe2: {
        position: 'absolute',
        backgroundColor: 'blue', /* Cor dos jogadores */
        padding: '10px',
        borderRadius: '5px',
        textAlign: 'center',
        margin: '5px 10px 5px 10px',
    },

    menuLateral: {
        width: '260px', 
        backgroundColor: '#808080', 
        padding: '20px',
        overflowY: 'auto',
    },

    menuLateralTitle: {
        color: '#000',
        margin: '10px 0 10px',
        backgroundColor: '#808080',
    },
    buttonApertar: {
        display: 'block',
        margin: '20px auto',
        padding: '10px 15px',
        backgroundColor: '#ff8c00',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
    },
    buttonSair: {
        position: 'fixed',
        bottom: '20px',
        right: '20px', 
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: '#FF0000',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },  
    botaoContainer: {
        display: 'flex', 
        justifyContent: 'center', 
        gap: '10px', 
        marginBottom: '20px', 
    },

    buttonEquipe1: {
        padding: '10px 20px',
        color: '#000',
        backgroundColor: '#FFFF00',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },   

    buttonEquipe2: {
        padding: '10px 20px',
        color: '#000',
        backgroundColor: '#FFA500',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    }, 
    buttonTruco: { 
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: '#4682B4',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },
    buttonEncerrarRodada: { 
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: '#f76b00',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },
    buttonEncerrarMao: { 
        padding: '10px 20px',
        color: 'fff',
        backgroundColor: '#ff0080',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },
    
    buttonIniciarJogo: { 
        padding: '10px 20px',
        color: '#fff',
        backgroundColor: 'green',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },
    caixinhaMensagem: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Centraliza horizontal e verticalmente
        backgroundColor: '#007bff', // Azul
        color: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 1000, // Garantir que fique acima de outros elementos
        animation: 'fadein 0.5s, fadeout 0.5s 4.5s', // Aparece e desaparece suavemente
        textAlign: 'center', // Centraliza o texto dentro da caixa
        //maxWidth: '80%', // Limita o tamanho da caixa
        //wordWrap: 'break-word', // Quebra texto longo
    },
    cartaVerso: {
        width: '50px', // Ajuste o tamanho conforme necessário
        height: '80px',
        borderRadius: '5px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '10px',
    },
    containerCartas: {
        position: 'absolute',
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)'
    },
    cartas: {
        width: '50px',
        height: '80px', 
        borderRadius: '8px'
    },
    //pontuacao
    pontuacao: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#f9f9f9',
        color: '#000',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        width: '130px', // Define uma largura fixa para manter consistência
        zIndex: 1000,
    },
    tituloPontuacao: {
        margin: 0,
        fontSize: '14px',
        textAlign: 'center',
        borderBottom: '1px solid #ccc',
        paddingBottom: '5px',
        marginBottom: '10px',
    },
    equipe: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    nomeEquipe: {
        fontSize: '12px',
        fontWeight: 'bold',
    },
    valorPontuacao: {
        fontSize: '12px',
    },
    divisor: {
        height: '1px',
        backgroundColor: '#ccc',
        margin: '10px 0',
    },

    //vencedor
    quadroVencedor: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        zIndex: 1000,
        //visibility: 'visible', //'hidden', // Inicialmente escondido
        visibility: 'hidden', // Inicialmente escondido
        opacity: 0, // Para animar a transição de entrada coloque 
        //opacity: 1, // Para animar a transição de entrada coloque 
        transition: 'opacity 0.5s ease, visibility 0.5s ease',
    },
    botaoVoltar: {
        marginTop: '20px',
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
    },
    botaoVoltarHover: {
        backgroundColor: '#45a049',
    },
   
    
};
