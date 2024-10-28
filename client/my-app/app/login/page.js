'use client'

import { useState } from 'react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const usuario = { email, senha };
        console.log('Login efetuado com:', usuario);
        setEmail('');
        setSenha('');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
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
                <button type="submit" style={styles.button}>Entrar</button>
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
        backgroundColor: '#1b4d3e', 
        color: '#fff',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '2rem',
        marginBottom: '20px',
        color: '#ffdf00', 
        textShadow: '1px 1px 2px #000',
    },
    form: {
        backgroundColor: '#2c6e49', 
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
        border: '1px solid #c8e6c9',
        outline: 'none',
        color: '#fff', 
        backgroundColor: '#3a6351', 
    },
    button: {
        width: '100%',
        padding: '10px',
        fontSize: '1rem',
        backgroundColor: '#ff8c00', 
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};
