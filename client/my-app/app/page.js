'use client'

import Link from 'next/link';
import { useContext, useState, useEffect } from "react";
import UserContext from './context/userContext';

export default function Home({children}) {

    const {user} = useContext(UserContext);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [userName, setUserName] = useState('Sem nome');

    useEffect(() => {
        if (user && user.nome) {
            setUserName(user.nome); // atualiza após a hidratação
        }
    }, [user]);

    return (
        <div style={styles.pageContainer}>
            <nav style={styles.nav}>
                <div style={styles.logoContainer}>
                    <img src="./logotruco.png" alt="Logo Truco Online" style={styles.logo} />
                </div>
                <div style={styles.navLinks}>
                    <Link href="/login" style={styles.navButton}>Login</Link>
                    <Link href="/cadastro" style={styles.navButton}>Cadastro</Link>
                    <Link href="/salas" style={styles.navButton}>Ver Salas</Link>
                </div>
                <div style={styles.navUser}>
                    
                    
                    {user && user.nome && (
                        <div style={styles.profileContainer} onClick={() => setDropdownVisible(!dropdownVisible)}>
                            <img src="./usuario.png" alt="Profile" style={styles.profileImage} />
                            <span style={styles.profileName}>{userName}</span>
                            <div style={dropdownVisible ? styles.dropdownMenuActive : styles.dropdownMenu}>
                                <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Logout
                                </a>
                            </div>
                        </div>
                    )}
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
            </div>
        </div>
    );
}

const styles = {
    pageContainer: {
        fontFamily: 'Arial, sans-serif',
    },
    nav: {
        // display: 'flex',
        // justifyContent: 'space-between',
        // alignItems: 'center',
        // padding: '20px',
        // // backgroundColor: '#ecac44', 
        // backgroundColor: '#4f0405',
        // color: '#fff',

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        background: 'radial-gradient(circle, #4f0405, #2e0203 70%)', // Gradiente radial
        color: '#fff',
    },
    logoContainer: {
        flex: 1,
    },
    logo: {
        width: '100px',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#4f0405', // Mesma cor do fundo do seu `nav`
        border: 'none',
    },
    navLinks: {
        display: 'flex',
        gap: '15px',
        // alignItems: 'center',
        flex:'none',
    },
    navUser: {
        flex: '1',
        display: 'flex',
        justifyContent: 'flex-end', 
        gap: '15px',
        alignItems: 'center',
    },
    // navButton: {
    //     color: 'black',
    //     textDecoration: 'none',
    //     fontSize: '1.2rem',
    //     padding: '10px',
    //     backgroundColor: '#555555 ',
    //     borderRadius: '5px',
    //     transition: 'background-color 0.3s',
    //     margin: '10px',
    // },

    navButton: {
        backgroundColor: '#000000', // Escolha a cor principal
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '1.2rem',
        padding: '10px 20px',
        borderRadius: '5px',
        border: '2px solid #ffd700',
        transition: 'background-color 0.3s, transform 0.2s',
    },
    navButtonHover: {
        backgroundColor: '#ffd700', // Amarelo ouro
        color: '#000000', // Preto
    },
    
    
    profileContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        position: 'relative',
    },
    profileImage: {
        width: '50px',  
        height: '50px',
        borderRadius: '50%',  
    },
    profileName: {
        marginTop: '10px',
        color: '#fff',
        fontSize: '1rem',
    },
    dropdownMenu: {
        display: 'none',
        position: 'absolute',
        top: '100%',
        right: '0',
        backgroundColor: '#ffffff',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
        zIndex: '1',
    },
    dropdownMenuActive: {
        display: 'block',
    },
    container: {

        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 80px)', // Calcula a altura total menos a navbar
        background: 'black url("./casino.jpg") no-repeat', // Caminho da imagem
        backgroundSize: 'auto', // Faz a imagem cobrir toda a área do container
        // backgroundRepeat: 'no-repeat', // Evita repetição da imagem
        // backgroundPosition: 'left center', // Centraliza a imagem
        color: '#fff', // Cor do texto para contraste
        textAlign: 'left',
        padding: '0 20px',
    },
    title: {
        // fontSize: '2.5rem',
        // marginBottom: '20px',
        // color: '#ffdf00',
        // textShadow: '2px 2px 4px #000',

        fontSize: '3rem',
        marginBottom: '20px',
        color: '#ff0000', // Vermelho do texto principal
        textShadow: `
            0px 0px 8px #ff0000,   /* Brilho vermelho */
            0px 0px 16px #ff0000,  /* Brilho mais intenso */
            2px 2px 4px #000       /* Sombra preta leve */
        `,
        WebkitTextStroke: '2px #ffffff', // Borda branca ao redor do texto
        fontWeight: 'bold', // Deixa o texto mais espesso
        textTransform: 'uppercase',
        
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
    paragraph: {
        fontSize: '1.1rem',
        color: '#e0f2e9',
        marginBottom: '20px',
        lineHeight: '1.7',
        maxWidth: '700px',
        textAlign: 'justify',
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
        alignItems: 'left',
    },
};
