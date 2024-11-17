'use client'

import { useState, useEffect, useRef, use } from "react";
import Equipes from '../../../components/equipes'
import { redirect, useParams, useRouter } from 'next/navigation';


export default function Equipe() {
   
    return (
        <div style={styles.jogoContainer}>
            <Equipes />
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
