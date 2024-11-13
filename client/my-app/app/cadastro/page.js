'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CadastroUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();

    const AddUsuario = async (usuario) => {
        try {
            const response = await fetch('http://localhost:5000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuario),
            });
    
            const data = await response.json(); 
    
            if (!response.ok) {
                throw new Error(data.msg || 'Erro ao cadastrar usuário'); 
            }
            else{
                router.push('/login'); 
            }
    
            console.log('Usuário cadastrado com sucesso:', data);
            return data;
    
        } catch (error) {
            console.error('Falha ao cadastrar usuário:', error.message);
        }
    };

    const handleClick = async () => {
        const usuario = { nome, email, senha };
        console.log('Usuário cadastrado:', usuario);
        await AddUsuario(usuario);
        setNome('');
        setEmail('');
        setSenha('');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Faça seu Cadastro e Jogue</h1>
            <form style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="nome" style={styles.label}>Nome:</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        style={styles.input}
                    />
                </div>
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
                <button type="button" onClick={handleClick} style={styles.button}>Cadastrar</button>
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
    }
};
