'use client';

import { useRef, useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

export default function Salas() {

    const router = useRouter();
    const URL = 'http://localhost:5000';
    const URLFront = 'http://localhost:3000';
    const [lista, setLista] = useState([]);
    const [idAlteracao, setAlteracao] = useState(0);
    const sala = useRef('');
    let socket;

    useEffect(() => {
        listarSalas();
    }, []);
    
    async function listarSalas() {
        try {
            const token = getCookie('token'); 

            const response = await fetch(URL + '/salas', {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`, 
                }
                });
            const data = await response.json();
            setLista(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao listar salas:", error);
            setLista([]); 
        }
    }
    
    function getUserIdFromToken(token) {
        if (!token) return null;
        const decodedToken = JSON.parse(atob(token.split('.')[1])); 
        return decodedToken.id; 
    }

    async function criarSala() {
        const token = getCookie('token'); 
        const nomeSala = sala.current.value.trim();
        const usu_id = getUserIdFromToken(token); 

        if (nomeSala && usu_id ) {
            try {
                const response = await fetch(URL + '/salas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`, 
                    },
                    body: JSON.stringify({ nome: nomeSala, usu_id })
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
        const token = getCookie('token'); 
    
        if (token) {
            router.push(URLFront + "/salas/" + sal_id + "/equipes");

            //router.push(URLFront + "/salas/" + sal_id);
        } else {
            alert("Você precisa estar logado para entrar em uma sala.");
            router.push('/login'); 
        }
    }

    function sairDaSala() {
        socket.emit('disconnect');
        console.log('Usuário saiu da sala');

    }

    return (
        <div style={{ margin: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '16px', padding: '15px' }}>Nome da Sala:</label>
                <input ref={sala} type="text" placeholder="Nome da Sala" style={{ padding: '10px', fontSize: '14px', width: '300px', marginRight: '10px', borderRadius: '4px' }} />
                <button onClick={criarSala} style={{ padding: '10px 20px', fontSize: '14px', backgroundColor: '#ffd700', color: 'black', border: 'none', borderRadius: '4px' }}>
                    Criar
                </button>
            </div>

            <table style={{ borderCollapse: 'collapse', width: '100%', borderRadius: '8px', overflow: 'hidden', height: 'auto' }}>
                <thead>
                    {/* <tr>
                        <th colSpan="3" style={{ padding: '10px' }}>
                            <label>Nome da Sala:</label>
                            <input ref={sala} type="text" placeholder="Nome da Sala" style={{ margin: '0 10px', color: "black" }} />
                            <button onClick={criarSala}>Criar</button>
                        </th>
                    </tr> */}
                    <tr style={{ backgroundColor: '#4f0405', borderBottom: '2px solid #ccc',width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                        <th style={{ textAlign: 'center',padding: '10px', color: 'white'}}>Nome</th>
                        <th style={{ textAlign: 'center',padding: '10px', color: 'white'}}>Participantes</th>
                        <th ></th>
                    </tr>
                </thead>
                <tbody >
                    {lista.map((value) => (
                        <tr key={value.sal_id} style={{ borderBottom: '1px solid #ccc'}}>
                            <td style={{ padding: '10px' }}>{value.nome}</td>
                            <td style={{ padding: '10px' }}>{value.qtde_participantes}</td>
                            {value.qtde_participantes < 4 ? (
                                <td style={{ padding: '10px' }}>
                                    <button onClick={() => entrar(value.sal_id)} style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#be1218', color: 'white', border: 'none', borderRadius: '4px' }}>Entrar</button>
                                </td> 
                            ) : (
                                <p style={{ padding: '10px' }}>Sala cheia</p>
                            )}
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
