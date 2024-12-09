'use client'

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Salas from '../components/salas';

export default function Sala() {

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Salas de Truco Disponíveis</h1>
            <span>Escolha uma sala ou crie e jogue</span>

            <Salas />
            
            {/* <p style={styles.description}>
                Jogue truco com amigos e desafie outros jogadores online! Prepare-se para muita diversão e emoção com o nosso jogo de truco online.
            </p>
            <div style={styles.buttonsContainer}>
                <Link href="/" style={styles.button}>
                    Jogar
                </Link>
            </div> */}
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Manter o conteúdo na parte superior da tela
        height: '100vh',  // A altura vai ocupar toda a tela
        backgroundColor: '#000',  // Fundo escuro
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '0 20px',
        overflow: 'auto', // Adiciona a rolagem automática quando necessário
    },
    title: {
        fontSize: '3rem',
        marginBottom: '20px',
        color: '#ff0000', // Cor vermelha combinando com a página principal
        textShadow: `
            0px 0px 8px #ff0000, 
            0px 0px 16px #ff0000,  
            2px 2px 4px #000`,
        WebkitTextStroke: '2px #ffffff',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginTop: '150px',
        
    },
    description: {
        fontSize: '1.2rem',
        color: '#e0f2e9',
        marginBottom: '40px',
        maxWidth: '600px',
        lineHeight: '1.8',
        letterSpacing: '0.5px',
        textAlign: 'justify',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
    },
    buttonsContainer: {
        display: 'flex',
        gap: '15px',
    },
    button: {
        display: 'inline-block',
        padding: '10px 20px',
        fontSize: '1rem',
        color: '#fff',
        backgroundColor: '#ff8c00',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'background-color 0.3s',
    },
    startButton: {
        padding: '10px 20px',
        fontSize: '1rem',
        backgroundColor: '#008c4a',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};
