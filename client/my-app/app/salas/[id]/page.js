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

    function entrou(params) {
        const token = getCookie('token'); 

        fetch(URL + '/salas/adicionar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify({nome: 'jogador1', sala: id})
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {            
            // setEventos(eventos => [...eventos, `O jogador ${params.participante} entrou na sala!`])
            setEventos(eventos => [...eventos, `O jogador entrou na sala!`]);

        })
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    
    function teste() {
        // alert(`O jogador ${params.participante} apertou o botão`)
        alert(`O jogador apertou o botão`)
    }

    function emitirTeste() {
        socket.current.emit("teste", {codSala: id});
    }

    useEffect(() => {
        //Sempre que precisar utilizar websocket em um componente, faça isso no useEffect, pois através dele conseguimos ter a certeza que o código não será reexecutado quando houver mudança de estado.
        //iniciar a conexao com o server passando os dados da sala e do participante

        // socket.current = io(URL, {query: `codSala=${id}&nome=${nomeUsuario}`});
       
        socket.current = io(URL, {query: `codSala=${id}`});

        socket.current.on("connect", () => {
            console.log("Conectado ao servidor WebSocket");
        });

        socket.current.on('entrar', entrou);
        socket.current.on("teste", teste);

        
        return () => {
            socket.current.off('entrar', entrou);
            socket.current.off("teste", teste);
            socket.current.disconnect();
          };
    }, [id, URL]);
   

    return (
        <div>
            <h1>Bem vindo à sala {id}</h1>
            {/* <h2>Olá, {nomeUsuario}!</h2> */}
            <h2>Olá!</h2>
            <button onClick={emitirTeste}>Aperte aqui</button>
            <div>

            </div>
        </div>
    )

}