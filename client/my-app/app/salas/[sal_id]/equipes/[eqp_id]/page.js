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

    const posicoesEquipe1 = [
        { top: '10%', left: '50%' },
        { bottom: '10%', left: '50%' },
    ];
    
    const posicoesEquipe2 = [
        { top: '50%', left: '0%' },
        { top: '50%', right: '0%' },
    ];

    useSocketEvent('setup', (command) => {
        console.log('Recebendo o evento setup');
        setJogadores(Object.values(command.jogadores));
    });

    useSocketEvent('add-player', (command) => {
        console.log('Recebendo o evento add-player');
        setJogadores((prev) => [...prev, command.jogador]);
    });

    useSocketEvent('player-disconnected', (command) => {
        console.log('Recebendo o evento player-disconnected');
        setJogadores((prev) => prev.filter((jogador) => jogador.id !== command.jogador.id));
    });

    useSocketEvent('nova-mao', (command) => {
        console.log('Recebendo o evento nova-mao');
        setJogadores(Object.values(command.jogadores));
        setMaos((prev) => [...prev, command.mao]);
        setMaoAtual(command.mao);
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

    function renderizarCartas(cartas) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {cartas.map((carta, index) => (
                    <img 
                        key={index} 
                        src={carta.image} 
                        alt="Cartas Truco" 
                        style={styles.cartas} 
                    />
                ))}
            </div>        
        );
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

                {/* POSICIONANDO EQUIPE 1 */}
                {jogadores.filter((jogador) => jogador.eqp_id != 2).map((jogador, index) => (
                    <div key={index} style={{ ...styles.jogadorEquipe1, ...posicoesEquipe1[index] }}>
                        <h3>{jogador.nome} {jogador.id == idJogador ? ' (Você)' : ''}</h3>
                        {Object.keys(maoAtual).length > 0 &&  
                            ( jogador.id == idJogador ? (
                                jogador.cartas.map((carta, index) => (
                                    <div style={{ position: 'absolute', bottom: '30%', left: '50%', transform: 'translateX(-50%)' }}>
                                       {renderizarCartas(jogador.cartas)}
                                    </div>
                                    // <img key={index} src={carta.image} alt="Cartas Truco" style={styles.cartas} />
                                ))
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    <img src="/cartaVerso.png" alt="Cartas Truco" style={styles.cartaVerso} />
                                    <img src="/cartaVerso.png" alt="Cartas Truco" style={styles.cartaVerso} />
                                    <img src="/cartaVerso.png" alt="Cartas Truco" style={styles.cartaVerso} />
                                </div>
                            ))
                        }
                        {/* {jogador.id == idJogador && jogador.cartas ? 
                        (jogador.cartas.map((carta, index) => (
                            <img key={index} src={carta.image} alt="Cartas Truco" style={styles.cartas} />
                        ))) 
                        : (<img key={index} src="/cartaVerso.png" alt="Cartas Truco" style={styles.cartas} />)} */}
                    </div> 
                ))}
                {/* POSICIONANDO EQUIPE 2*/}
                {jogadores.filter((jogador) => jogador.eqp_id != 1).map((jogador, index) => (
                    <div key={index} style={{ ...styles.jogadorEquipe2, ...posicoesEquipe2[index] }}>
                        <h3>{jogador.nome} {jogador.id == idJogador ? ' (Você)' : ''}</h3>
                    </div> 
                ))}


                <div style={styles.mesa}>
                    <h2>Mesa de Truco</h2>
                    {maoAtual.vira == null ? '' : <img src={maoAtual.vira.image} alt="Cartas Truco" style={styles.cartaVerso} />}   
                </div>
            </div>
            
            <div style={styles.menuLateral}>
                <div style={styles.botaoContainer}>
                    <h2 style={styles.menuLateralTitle}>Jogadores na Sala</h2>
                </div>
                <br />
                {jogadores.map((jogador, index) => (
                    <p key={index}>{jogador.nome}</p>
                ))}
                <br />

                <br />
                <div style={styles.botaoContainer}>
                    <button style={styles.buttonTruco} onClick={() => getSocket.emit("teste", { codSala: sal_id })}>Pedir truco</button>
                </div>
                <div style={styles.botaoContainer}>
                    {jogadores.length == 4 && (
                        <button style={styles.buttonIniciarJogo} onClick={() => getSocket.emit("nova-mao", { sal_id: sal_id })}>Iniciar Jogo</button>
                    )}
                    
                </div>
            </div>
            <button style={styles.buttonSair} className="button-sair" onClick={sair}>Sair do Jogo</button>
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
        width: '60%',
        height: '60%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
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
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginTop: '40px',
    },
    
};
