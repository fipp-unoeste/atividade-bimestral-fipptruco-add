'use client'

import Link from 'next/link';

export default function Home() {
    return (
        <div style={styles.pageContainer}>
            <nav style={styles.nav}>
                <div style={styles.logoContainer}>
                    <img src="./logo-truco-megajogos.png" alt="Logo Truco Online" style={styles.logo} />
                </div>
                <div style={styles.navLinks}>
                    <Link href="/login" style={styles.navButton}>Login</Link>
                    <Link href="/cadastro" style={styles.navButton}>Cadastro</Link>
                    <Link href="/salas" style={styles.navButton}>Ver Salas</Link>
                </div>
            </nav>

            <div style={styles.container}>
                <h1 style={styles.title}>Truco Online</h1>
                <p style={styles.description}>
                    Jogue truco com amigos e desafie outros jogadores online! 
                </p>
                <p style={styles.paragraph}>
                    Prepare-se para muita diversão e emoção com o nosso jogo de truco online.
                </p>
                <p style={styles.paragraph}>
                    O Truco é aquele jogo que mistura sorte, estratégia e, claro, muito bluff! Quem nunca mandou um "truco" de forma dramática só para ver o oponente suando frio? Com suas regrinhas cheias de truques (literalmente!), o jogo exige mais do que sorte: é preciso saber blefar, enganar e, acima de tudo, ser audacioso. Seja no barzinho com os amigos ou em uma partida online, o Truco nunca é monótono. Ele é aquele jogo que faz você gritar “TRUCO!” no meio da partida, mesmo que não tenha carta boa, só para deixar a galera nervosa. Prepare-se para altas risadas, zoações e, quem sabe, aquele truque de mestre que vai deixar todo mundo boquiaberto!
                </p>
                {/* <div style={styles.buttonsContainer}>
                    <Link href="/login" style={styles.button}>
                        Login
                    </Link>
                    <Link href="/cadastro" style={styles.button}>
                        Cadastro
                    </Link>
                    <Link href="/salas" style={styles.button}>
                        Começar Partida
                    </Link>
                </div> */}
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        fontFamily: 'Arial, sans-serif',
    },
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#ecac44', 
        color: '#fff',
    },
    logoContainer: {
        flex: 1,
    },
    logo: {
        width: '100px',
        height: 'auto',
    },
    navLinks: {
        display: 'flex',
        gap: '15px',
    },
    navButton: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '1rem',
        padding: '10px 20px',
        backgroundColor: '#228B22',
        borderRadius: '5px',
        transition: 'background-color 0.3s',
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 80px)', 
        backgroundColor: '#004d00',
        color: '#fff',
        textAlign: 'center',
        padding: '0 20px',
    },
    title: {
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#ffdf00',
        textShadow: '2px 2px 4px #000',
    },
    description: {
        fontSize: '1.2rem',
        color: '#e0f2e9',
        marginBottom: '40px',
        maxWidth: '600px',
        lineHeight: '1.8', // Aumenta o espaçamento entre as linhas para melhor legibilidade
        letterSpacing: '0.5px', // Adiciona um pouco de espaçamento entre as letras
        textAlign: 'justify', // Justifica o texto para dar uma aparência mais formal e organizada
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)', // Sombra para dar mais destaque ao texto
    },
    paragraph: {
        fontSize: '1.1rem', // Tamanho maior para o corpo do texto
        color: '#e0f2e9',
        marginBottom: '20px',
        lineHeight: '1.7',
        maxWidth: '700px',
        textAlign: 'justify', // Justifica o texto para dar uma aparência mais agradável
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)', // Sombra suave para o parágrafo
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
};

