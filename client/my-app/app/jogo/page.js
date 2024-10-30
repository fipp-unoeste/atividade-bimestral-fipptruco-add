'use client'
import { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';

export default function Sala({params: {sal_id}, nomeUsuario}) {

    const URL = 'http://localhost:5000';
    const [eventos, setEventos] = useState([]);
    let socket = useRef()

    function entrou(params) {
        fetch('http://localhost:5000/adicionar', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({nome: nome, sala: sal_id})
        })
        .then(r=> {
            return r.json();
        })
        .then(r=> {            
            setEventos(eventos => [...eventos, `O jogador ${params.participante} entrou na sala!`])
        })
    }

    function teste() {
        alert(`O jogador ${params.participante} apertou o botão`)
    }

    function emitirTeste() {
        socket.current.emit("teste", {codSala: sal_id});
    }

    useEffect(() => {
        //Sempre que precisar utilizar websocket em um componente, faça isso no useEffect, pois através dele conseguimos ter a certeza que o código não será reexecutado quando houver mudança de estado.
        //iniciar a conexao com o server passando os dados da sala e do participante
        socket.current = io(URL, {query: `codSala=${sal_id}&nome=${nomeUsuario}`});
        socket.current.on('entrar', entrou);
        socket.current.on("teste", teste);

        return () => {
            socket.current.off('entrar', entrou);
            socket.current.off("teste", teste);
            socket.current.disconnect();
          };
    }, [sal_id, nomeUsuario]);

    return (
        <div>
            <h1>Bem vindo à sala {id} - {nome}</h1>
            <h2>Olá, {nomeUsuario}!</h2>
            <button onClick={emitirTeste}>Aperte aqui</button>
            <div>
                {
                    eventos.map(function(value, index) {
                        return <div>{value}</div>
                    })
                }
            </div>
        </div>
    )

}