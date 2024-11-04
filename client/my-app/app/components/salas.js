'use client';

import { useRef, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export default function Salas() {

    const router = useRouter();
    const URL = 'http://localhost:5000';
    const URLFront = 'http://localhost:3000';
    const [lista, setLista] = useState([]);
    const sala = useRef('');
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            console.log("Token disponível no contexto:", token);
            listarSalas();
        }
    }, [token]);
    
    async function listarSalas() {

        try {
            console.log("Listando salas com token:", token);

            const response = await fetch(URL + '/salas', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`, 
                }
                });
            const data = await response.json();
            setLista(Array.isArray(data) ? data : []);
            console.log("Salas recebidas do servidor:", data);

        } catch (error) {
            console.error("Erro ao listar salas:", error);
            setLista([]); 
        }
    }
    
    async function criarSala() {
        const nomeSala = sala.current.value.trim();
        if (nomeSala) {
            try {
                const response = await fetch(URL + '/salas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`, 
                    },
                    body: JSON.stringify({ nome: nomeSala })
                });
                if (response.ok) {
                    alert("Sala criada com sucesso!");
                    listarSalas();  
                    sala.current.value = "";  
                } else {
                    const errorData = await response.json();
                    console.error("Erro ao criar sala:", errorData);
                    alert("Erro ao criar sala! " + (errorData.message || ""));
                }
            } catch (error) {
                console.error("Erro ao criar sala:", error);
                alert("Erro de conexão ao tentar criar sala.");
            }
        } else {
            alert("Por favor, insira o nome da sala.");
        }
    }
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function entrar(sal_id) {
    
        if (token) {
            console.log("Entrando na sala:", sal_id, "com token:", token);
            router.push(URLFront + "/salas/" + sal_id);
        } else {
            console.warn("Tentativa de entrar em uma sala sem token. Redirecionando para login.");
            alert("Você precisa estar logado para entrar em uma sala.");
            router.push('/login'); 
        }
    }

    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    <th colSpan="3" style={{ padding: '10px' }}>
                        <label>Nome da Sala:</label>
                        <input ref={sala} type="text" placeholder="Nome da Sala" style={{ margin: '0 10px', color: "black" }} />
                        <button onClick={criarSala}>Criar</button>
                    </th>
                </tr>
                <tr style={{ backgroundColor: '#4CAF50', borderBottom: '2px solid #ccc' }}>
                    <th style={{ textAlign: 'left' }}>Nome</th>
                    <th style={{ textAlign: 'left' }}>Lotação</th>
                    <th style={{ textAlign: 'left' }}>Entrar</th>
                </tr>
            </thead>
            <tbody>
                {lista.map((value) => (
                    <tr key={value.sal_id} style={{ borderBottom: '1px solid #ccc' }}>
                        <td style={{ padding: '8px' }}>{value.nome}</td>
                        <td style={{ padding: '8px' }}>2</td>
                        <td style={{ padding: '8px' }}>
                            <button onClick={() => entrar(value.sal_id)}>Entrar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
