'use client'
import { useState, useEffect, useRef, use } from "react";
import { io } from 'socket.io-client';
import { redirect, useParams, useRouter } from 'next/navigation';


export default function Sala() {
    const params = useParams(); 
    const { sal_id, eqp_id } = params; 
    const URL = 'http://localhost:5000';
    const URLFront = 'http://localhost:3000';
    const router = useRouter();

    const [eventos, setEventos] = useState([]);
    let socket = useRef(null);

    const [nomeJogador, setNomeJogador] = useState(''); 
    const [idJogador, setIdJogador] = useState(''); 
    const [nomeOutrosJogadores, setOutrosJogadores] = useState([]);

    // const [jogador, setJogador] = useState({}); 

    let idUsuario = '';
    const [jogadorAdicionado, setJogadorAdicionado] = useState(false);  

    function entrou(params) {
        const token = getCookie('token'); 

        fetch(URL + '/salas/adicionar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify({nome: nomeJogador, salaId: sal_id, idUsuario: idJogador, eqp_id: eqp_id})
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {
            if(!r.ok){
                console.error('Erro:', r.msg);
                alert(r.msg);
                router.push('/salas'); 
            }
            return r;
        })
        .then(r=> {            

            socket.current.emit("mensagem", 
                {
                    mensagem:`O jogador ${nomeJogador} entrou na sala`,
                    codSala: sal_id
                });

        })
        .catch(error => {
            console.error('Erro:', error);
            alert('teste');
            router.push('/salas'); 
        });
    }

    
    function buscarOutrosJogadores(params) {
        const token = getCookie('token'); 

        fetch(URL + `/participantes/outros_por_sala/${sal_id}/${idJogador}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            }
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {            
            setOutrosJogadores(r);
        })
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    


    function sairDoJogo() {
        socket.current.disconnect();
        alert('Você saiu do jogo.');
        router.push('/salas');   
    }

    useEffect(() => {
        if (nomeJogador !== '') {
            entrou(); 

            buscarOutrosJogadores();

            socket.current = io(URL, { query: `codSala=${sal_id}&idUsuario=${idJogador}&nome=${nomeJogador}` });

            socket.current.on("connect", () => {
                console.log("Conectado ao servidor WebSocket");
            });
    
            socket.current.on("teste", () => {
                alert(`${nomeJogador} apertou o botão`)
            });

            socket.current.on("mensagem", (mensagem) => {
                setEventos(eventos => [...eventos, mensagem.mensagem]);
            });
    
    
            return () => {
                socket.current.disconnect();
            };
        }
    }, [nomeJogador,idJogador]); 

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
                setNomeJogador(data.nome);
                setIdJogador(data.id);
                setJogadorAdicionado(true);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });




    }, [sal_id, URL]);
   
    return (
        <div style={styles.jogoContainer}>
            <div style={styles.mesaJogo}>
                <div style={{ ...styles.jogador, top: '10%', left: '50%' }}>
                    <h3></h3>
                </div> 
                 <div style={{ ...styles.jogador, top: '50%', left: '0%' }}>
                    <h3></h3>
                </div>
                <div style={{ ...styles.jogador, top: '50%', right: '0%' }}>
                    <h3></h3>
                </div>
                <div style={{ ...styles.jogador, bottom: '10%', left: '50%' }}>
                    <h3>{nomeJogador}</h3>
                </div>
                <div style={styles.mesa}>
                    <h2>Mesa de Truco</h2>
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
                    <button style={styles.buttonTruco} onClick={() => socket.current.emit("teste", { codSala: sal_id })}>Pedir truco</button>
                </div>
            </div>
            <button style={styles.buttonSair} className="button-sair" onClick={sairDoJogo}>Sair do Jogo</button>
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

    jogador: {
        position: 'absolute',
        backgroundColor: '#FF0000', /* Cor dos jogadores */
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
};
