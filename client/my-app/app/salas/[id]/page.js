'use client'
import { useState, useEffect, useRef, use } from "react";
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';

export default function Sala() {
    const params = useParams(); 
    const { id } = params; 
    const URL = 'http://localhost:5000';
    const URLFront = 'http://localhost:3000';

    const [eventos, setEventos] = useState([]);
    let socket = useRef(null);

    const [nomeJogador, setNomeJogador] = useState(''); 
    const [jogadorAdicionado, setJogadorAdicionado] = useState(false);  

    function entrou(params) {
        const token = getCookie('token'); 

        fetch(URL + '/salas/adicionar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify({nome: nomeJogador, sala: id})
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {            
            setEventos(eventos => [...eventos, `${nomeJogador} entrou na sala!`]);
        })
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    function teste() {
        alert(`${nomeJogador} apertou o botão`);
    }

    function emitirTeste() {
        socket.current.emit("teste", {codSala: id});
    }

    function sairDoJogo() {
        socket.current.disconnect();
        alert('Você saiu do jogo.');
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
                setNomeJogador(data.nome);
                setJogadorAdicionado(true);
                entrou(); 
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });

        socket.current = io(URL, { query: `codSala=${id}` });

        socket.current.on("connect", () => {
            console.log("Conectado ao servidor WebSocket");
        });

        socket.current.on("teste", () => {
            alert(`${nomeJogador} apertou o botão`)
        });

        return () => {
            socket.current.disconnect();
        };

    }, [id, URL]);
   
    return (
        <div style={styles.jogoContainer}>
            <div style={styles.mesaJogo}>
                <div style={{ ...styles.jogador, top: '10%', left: '50%' }}>
                    <h3>{nomeJogador}</h3>
                </div>
                <div style={{ ...styles.jogador, top: '50%', left: '0%' }}>
                    <h3>{nomeJogador}</h3>
                </div>
                <div style={{ ...styles.jogador, top: '50%', right: '0%' }}>
                    <h3>{nomeJogador}</h3>
                </div>
                <div style={{ ...styles.jogador, bottom: '10%', left: '50%' }}>
                    <h3>{nomeJogador}</h3>
                </div>
                <div style={styles.mesa}>
                    <h2>Mesa de Truco</h2>
                </div>
            </div>
            <div style={styles.menuLateral}>
                <h2 style={styles.menuLateralTitle}>Mensagens</h2>
                <button onClick={() => socket.current.emit("teste", { codSala: id })}>Aperte aqui Antigo</button>
                <hr></hr>
                {eventos.map((evento, index) => (
                    <p key={index}>{evento}</p>
                ))}
            </div>
            <button className="button-sair" onClick={sairDoJogo}>Sair do Jogo</button>
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
        backgroundColor: '#004d00', /* Cor da mesa */
    },

    mesa: {
        position: 'absolute',
        backgroundColor: '#004d00', /* Cor da mesa */
        // border: '2px solid #000',
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
        width: '220px', 
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
        position: 'block',
        bottom: '20px',
        left: '50%',
        padding: '10px 20px',
        color: '#fff',
        border: 'solid',
        borderRadius: '5px',
        cursor: 'pointer',
        backgroundColor: '#FF0000',      
        textAlign: 'center',
    },
};

