'use client';

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';

export default function Equipes() {

    const router = useRouter();
    const URL = 'http://localhost:5000';
    const URLFront = 'http://localhost:3000';
    const params = useParams(); 
    const { sal_id } = params;     
    
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

    function renderizarLinhas(){
            return (
                <div>
                    
                    <button onClick={() => entrar(1)}>Entrar pela Equipe 1</button>
                    <br/>
                    <button onClick={() => entrar(2)}>Entrar pela Equipe 2</button>
            </div>
            );
        
    }

    return (
        <div>
            { renderizarLinhas() }
        </div>
    );
}
