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
    const [idEquipe, setIdEquipe] = useState(''); 
    const [jogadores, setJogadores] = useState([]);
    const [maos, setMaos] = useState([]);
    const [maoAtual, setMaoAtual] = useState({});
    const [rodadaEncerrada, setRodadaEncerrada] = useState(false);
    const [equipeVencedoraId, setEquipeVencedoraId] = useState('');
    const [maoEncerrada, setMaoEncerrada] = useState(false);
    const [pontosEquipe1, setPontosEquipe1] = useState(0);
    const [pontosEquipe2, setPontosEquipe2] = useState(0);
    const [desconectarTodos, setDesconectarTodos] = useState(false);
    const [jogoEncerrado, setJogoEncerrado] = useState(false);
    const [equipeTrucadoraId, setEquipeTrucadoraId] = useState('');
    const [nomeTrucador, setNomeTrucador] = useState('');
    const [botaoIniciarJogo, setBotaoIniciarJogo] = useState(false);
    const [botaoTrucar, setBotaoTrucar] = useState(false);

    const posicoesEquipe1 = [
        { top: '20%', left: '50%' },
        { bottom: '0%', left: '50%' },
    ];
    
    const posicoesEquipe2 = [
        { top: '50%', left: '10%' },
        { top: '50%', right: '10%' },
    ];

    useSocketEvent('setup', (command) => {
        console.log('Recebendo o evento setup');
        setJogadores(Object.values(command.jogadores));
    });

    useSocketEvent('add-player', (command) => {
        console.log('Recebendo o evento add-player');
        if (jogadores.length == 3)
            setBotaoIniciarJogo(true);

        setEventos((prev) => [...prev, `${command.jogador.nome} entrou na sala pela equipe ${eqp_id}`]);
        setJogadores((prev) => [...prev, command.jogador]);
    });

    useSocketEvent('player-disconnected', (command) => {
        console.log('Recebendo o evento player-disconnected');
        setEventos((prev) => [...prev, `${command.jogador.nome} saiu da sala`]);
        setJogadores((prev) => prev.filter((jogador) => jogador.id !== command.jogador.id));
        if (maoAtual) {
            setDesconectarTodos(true);
        }
    });

    useSocketEvent('nova-mao', (command) => {
        console.log('Recebendo o evento nova-mao');
        setEventos((prev) => [...prev, `Nova mão iniciada`]);
        setJogadores(Object.values(command.jogadores));
        setMaoAtual(command.mao);
        setMaoEncerrada(false);
        setBotaoIniciarJogo(false);
        setBotaoTrucar(true);
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
        setRodadaEncerrada(false);

        if(command.maoEncerrada) {
            setEventos((prev) => [...prev,'Equipe vencedora da Mão: '+ command.equipeVencedoraId]);
            setEquipeVencedoraId(command.equipeVencedoraId);
    
            if (command.equipeVencedoraId == 1) {
                setPontosEquipe1((prev) => prev + command.mao.valor );
            } else {
                setPontosEquipe2((prev) => prev + command.mao.valor );
            }
        }
    });

    useSocketEvent('jogo-encerrado', (command) => {
        console.log('Recebendo o evento jogo encerrado');
        setJogoEncerrado(true);
        setMaoEncerrada(false);
        setRodadaEncerrada(false);
        setEventos((prev) => [...prev,'Jogo Encerrado']);
        setEventos((prev) => [...prev,'Equipe vencedora do Jogo: '+ command.equipeVencedoraId]);
    });

    useSocketEvent('pediu-truco', (command) => {
        console.log('Recebendo o evento pediu truco');
        setEquipeTrucadoraId(command.jogador.eqp_id);
        setNomeTrucador(command.jogador.nome);
        setBotaoTrucar(false);
        setEventos((prev) => [...prev, `${command.jogador.nome} da equipe ${command.jogador.eqp_id} pediu truco`]);
    });

    useSocketEvent('aceitou-truco', (command) => {
        console.log('Recebendo o evento aceitou truco');
        setMaoAtual(command.mao);
        setEquipeTrucadoraId('');
        setNomeTrucador('');
        setEventos((prev) => [...prev, `${command.jogador.nome} da equipe ${command.jogador.eqp_id} aceitou o truco`]);
    });

    useSocketEvent('correu', (command) => {
        console.log('Recebendo o enveto correu');
        setEquipeTrucadoraId('');
        setNomeTrucador('');
        
        setMaoEncerrada(true);
        setEquipeVencedoraId(command.equipeVencedoraId);

        if (command.equipeVencedoraId == 1) {
            setPontosEquipe1((prev) => prev + command.mao.valor );
        } else {
            setPontosEquipe2((prev) => prev + command.mao.valor );
        }
        
        setEventos((prev) => [...prev, `${command.jogador.nome} da equipe ${command.jogador.eqp_id} correu`]);
        setEventos((prev) => [...prev,'Equipe vencedora da Mão: '+ command.equipeVencedoraId]);
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
    
    function iniciarJogo() {
        const socket = getSocket();
        socket.emit('nova-mao', {sal_id: sal_id });
        setBotaoIniciarJogo(false);
    }

    function pedirTruco() {
        const socket = getSocket();
        socket.emit('trucar');
    }

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
                        <p key={index}>{evento}</p>))}
                
                

                <br />
                <br />

                <div style={styles.botaoContainer}>
                    {botaoTrucar && (
                        <button style={styles.buttonTruco} onClick={pedirTruco}>Pedir truco</button>
                    )}
                </div>
                
                <div style={styles.botaoContainer}>
                    {botaoIniciarJogo && (
                        <button style={styles.buttonIniciarJogo} onClick={iniciarJogo}>Iniciar Jogo</button>
                    )}
                </div>
                
                <div style={styles.botaoContainer}>
                    {rodadaEncerrada && (
                        <div style={styles.overlay}>
                            <div style={styles.quadroVencedor}>
                                <h2>Clique para encerrar a rodada</h2>
                                <button style={styles.buttonEncerrarRodada} onClick={() => getSocket().emit("encerrar-rodada", { equipeVencedoraId: equipeVencedoraId })}>Encerrar rodada</button>
                            </div>
                        </div>
                    )}
                </div>

                <div style={styles.botaoContainer}>
                    {maoEncerrada && (
                        <div style={styles.overlay}>
                            <div style={styles.quadroVencedor}>
                                <h2>Clique para iniciar nova mão</h2>
                                <button style={styles.buttonEncerrarMao} onClick={() => getSocket().emit("encerrar-mao", { equipeVencedoraId: equipeVencedoraId })}>Nova mão</button>
                            </div>
                        </div>
                    )}
                </div>
                    
                
            </div>
            <button style={styles.buttonSair} className="button-sair" onClick={sair}>Sair do Jogo</button>

            {jogoEncerrado && (
                <div style={styles.overlay}>   
                    <div style={styles.quadroVencedor}>
                        <div>
                            <h2>Equipe {equipeVencedoraId} venceu</h2>
                            <button style={styles.botaoVoltar} onClick={sair}>
                                Voltar para Salas
                            </button>
                        </div>
                    </div>
                </div> 
            )}      

            {desconectarTodos && (
                <div style={styles.overlay}>  
                    <div style={styles.quadroVencedor}>
                        <div>
                            <h2>Um jogador desconectou no meio da partida</h2>
                            <button style={styles.botaoVoltar} onClick={sair}>
                                Voltar para Salas
                            </button>
                        </div>
                    </div>
                </div>  
            )}   

            {equipeTrucadoraId && equipeTrucadoraId != eqp_id && (
                <div style={styles.overlay}> 
                    <div style={styles.quadroVencedor}>
                        <div>
                            <h2>{nomeTrucador} da equipe {equipeTrucadoraId} pediu truco</h2>
                            <button style={styles.botaoVoltar} onClick={() => getSocket().emit("aceitar-truco") }>
                                Aceitar
                            </button>
                            <button style={styles.botaoVoltar} onClick={() => getSocket().emit("correr-truco") }>
                                Correr
                            </button>
                        </div>
                    </div> 
                </div>
            )}

            {equipeTrucadoraId && equipeTrucadoraId == eqp_id && (
                <div style={styles.overlay}> 
                    <div style={styles.quadroVencedor}>
                        <div>
                            <h2>Aguardando a outra equipe aceitar ou correr do truco...</h2>
                        </div>
                    </div> 
                </div>
            )}

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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'black',
        color: '#fff',
        padding: '10px',
        width: '260px',
        borderRadius: '8px',
        boxShadow: '2px 2px 8px rgba(0,0,0,0.5)',
        height: '100%', 
        overflow: 'auto',
    },

    menuLateralTitle: {
        color: '#ffd700',
        margin: '10px 0 10px',
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
        right: '11px', 
        padding: '10px',
        color: '#fff',
        backgroundColor: '#FF0000',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',
    },  
    buttonTruco: { 
        color: '#fff',
        backgroundColor: '#4682B4',
        position: 'fixed',
        bottom: '20px',
        right: '138px', 
        padding: '10px 20px',
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
   
    buttonEncerrarRodada: { 
        padding: '10px',
        color: '#fff',
        backgroundColor: '#f76b00',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',

        position: 'fixed',
        bottom: '65px',
        right: '11px', 

    },
    buttonIniciarJogo: { 
        padding: '10px',
        color: '#fff',
        backgroundColor: 'green',
        borderRadius: '5px',
        cursor: 'pointer',
        textAlign: 'center',
        border: 'none',
        fontSize: '16px',

        position: 'fixed',
        bottom: '20px',
        right: '154px', 
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

    botaoCorrer: {
        marginTop: '20px',
        padding: '10px 15px',
        backgroundColor: 'red',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.3s',
        margin:'10px',
    },

    //vencedor, pediuTruco, jogador saiu da sala
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor preta com transparência
        zIndex: 999, // Um nível abaixo do pop-up
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    quadroVencedor: {
        position: 'relative',
        width: '300px',
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        zIndex: 1000, // Acima do overlay
        opacity: 1, // Para animação
        transition: 'opacity 0.5s ease',
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
        margin: '10px',
    },
};
