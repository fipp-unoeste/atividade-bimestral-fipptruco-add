'use client'

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserContext from '../context/userContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();
    const {setUser} = useContext(UserContext);

    const BuscarUsuario = async (usuario) => {
        try {

            const response = await fetch('http://localhost:5000/usuarios/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });

            const data = await response.json(); 
            
            if (!response.ok) {
                throw new Error(data.msg || 'Erro ao fazer login de usuário'); 
            }
            else
            {
                setUser(data.usuario); 
                localStorage.setItem('usuario', JSON.stringify(data.usuario));
                router.push('/salas');            
            }

        } catch (error) {
            console.error('Falha no login do usuário:', error.message);
        }
    };

    const handleClick = async () => {
        const usuario = {email, senha };
        console.log('Usuário Logado:', usuario);
        await BuscarUsuario(usuario);
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <form style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="senha" style={styles.label}>Senha:</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="button" onClick={handleClick} style={styles.button}>Entrar</button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'black', 
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#ff0000', // Vermelho como na página Home
        textShadow: `
            0px 0px 8px #ff0000,   
            0px 0px 16px #ff0000,  
            2px 2px 4px #000       
        `,
        WebkitTextStroke: '2px #ffffff', 
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    form: {
        backgroundColor: '#4f0405',  // Usando o mesmo tom de fundo do nav
        padding: '20px 30px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        width: '100%',
        maxWidth: '400px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontSize: '1rem',
        color: '#e0f2e9', 
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        borderRadius: '4px',
        border: '1px solid #ffd700',
        outline: 'none',
        color: '#fff', 
        backgroundColor: '#4f0405', 
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        backgroundColor: '#ffd700', 
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};