'use client';

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';

export default function Equipes() {

    const router = useRouter();
    const URL = 'http://localhost:5000';
    const URLFront = 'http://localhost:3000';
    const params = useParams(); 
    const { sal_id } = params;   
    const [participantes, setParticipantes] = useState([]);
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function entrar(eqp_id) {
        const token = getCookie('token'); 
        if (token) {
            router.push(URLFront + "/salas/" + sal_id + "/equipes/" + eqp_id);
        } else {
            alert("Você precisa estar logado para entrar em uma sala.");
            router.push('/login'); 
        }
    }

    useEffect(() => {
        fetch(URL + '/participantes/por_sala/' + sal_id)
            .then(response => response.json())
            .then(data => setParticipantes(data))
            .catch(error => console.log(error));

    }, [sal_id]);

    function renderizarLinhas(){
            return (
                <div style={{ fontFamily: 'Arial, sans-serif',background: 'radial-gradient(circle, #4f0405, #2e0203 70%)', color: '#fff',
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'}}>

                    <h1 style={{fontSize: '2.5rem',
                                marginBottom: '20px',
                                color: '#ff0000', // Vermelho vibrante, similar ao título da página principal
                                textShadow: `
                                    0px 0px 8px #ff0000, 
                                    0px 0px 16px #ff0000, 
                                    2px 2px 4px #000
                                `,
                                WebkitTextStroke: '2px #ffffff',
                                fontWeight: 'bold',
                                textTransform: 'uppercase',}}>
                                    Escolha sua Equipe
                    </h1>

                    <div style={{ display: 'flex',gap: '20px',marginTop: '20px',}}>
                        {participantes.filter(participante => participante.eqp_id != 2).length < 2 && (
                            <button style={{padding: '15px 30px',
                                fontSize: '1.2rem',
                                color: '#000',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                border: '2px solid #ffd700',
                                backgroundColor: '#ffa500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'center',}} onClick={() => entrar(1)}>
                                    Entrar pela Equipe 1
                            </button>
                        )}
                        
                        <br/>
                        {participantes.filter(participante => participante.eqp_id != 1).length < 2 && (
                            <button style={{ padding: '15px 30px',
                                fontSize: '1.2rem',
                                color: '#000',
                                textDecoration: 'none',
                                borderRadius: '10px',
                                border: '2px solid #ffd700',
                                backgroundColor: '#ffa500',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                textAlign: 'center',}} onClick={() => entrar(2)}>
                                    Entrar pela Equipe 2
                            </button>
                        )}

                    </div>

                    
            </div>
            );
        
    }

    return (
        <div>
            { renderizarLinhas() }
        </div>
    );
}
