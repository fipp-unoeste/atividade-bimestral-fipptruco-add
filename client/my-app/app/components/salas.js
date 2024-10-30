'use client';

import { useRef, useState, useEffect } from "react";

export default function Salas() {

    const [lista, setLista] = useState([]);
    const [idAlteracao, setAlteracao] = useState(0);
    const sala = useRef('');

    useEffect(() => {
        listarSalas();
    }, []);

    async function listarSalas() {
        try {
            const response = await fetch('/api/salas');
            const data = await response.json();
            setLista(data);
        } catch (error) {
            console.error("Erro ao listar salas:", error);
        }
    }

    async function criarSala() {
        if (sala.current.value !== "") {
            try {
                const response = await fetch('/api/salas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome: sala.current.value })
                });
                if (response.ok) {
                    alert("Sala criada com sucesso!");
                    listarSalas();
                    sala.current.value = "";
                } else {
                    alert("Erro ao criar sala!");
                }
            } catch (error) {
                console.error("Erro ao criar sala:", error);
            }
        } else {
            alert("Erro ao criar Sala!");
        }
    }

    async function confirmarAtualizacao() {
        try {
            const response = await fetch('/api/salas', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sal_id: idAlteracao, nome: sala.current.value })
            });
            if (response.ok) {
                alert("Sala atualizada com sucesso!");
                listarSalas();
                setAlteracao(0);
                sala.current.value = "";
            } else {
                alert("Erro ao atualizar sala!");
            }
        } catch (error) {
            console.error("Erro ao atualizar sala:", error);
        }
    }

    function entrar(sal_id) {
        const listaAtualizada = lista.filter(x => x.sal_id !== sal_id);
        setLista(listaAtualizada);
    }

    function iniciarAtualizacao(sal_id) {
        const registroAlteracao = lista.find(x => x.sal_id === sal_id);
        sala.current.value = registroAlteracao.nome;
        setAlteracao(sal_id);
    }

    return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
                <tr>
                    <th colSpan="6" style={{ padding: '10px' }}>
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
