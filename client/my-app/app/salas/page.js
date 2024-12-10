'use client'

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import Salas from '../components/salas';
import UserContext from '../context/userContext'; // Ajuste o caminho para o contexto
import { useRouter } from 'next/navigation';


export default function Sala() {

    const router = useRouter();
    const { user, logout } = useContext(UserContext);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [userName, setUserName] = useState('Sem nome');

    useEffect(() => {
        if (user && user.nome) {
            setUserName(user.nome);
        }
    }, [user]);

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (

        <div style={styles.pageContainer}>
            <nav style={styles.nav}>
                <div style={styles.logoContainer}>
                    <a href="/">
                        <img src="./logotruco.png" alt="Logo Truco Online" style={styles.logo} />
                    </a>
                </div>
                {/* <div style={styles.navLinks}>
                    <Link href="/login" style={styles.navButton}>Login</Link>
                    <Link href="/cadastro" style={styles.navButton}>Cadastro</Link>
                    <Link href="/salas" style={styles.navButton}>Ver Salas</Link>
                </div> */}
                <div style={styles.navUser}>
                    
                    
                    {user && user.nome && (
                        <div style={styles.profileContainer} onClick={() => setDropdownVisible(!dropdownVisible)}>
                            <img src="./usuario.png" alt="Profile" style={styles.profileImage} />
                            <span style={styles.profileName}>{userName} <img src="./expandbutton.png" style={styles.expandbutton}></img></span>
                            <div style={dropdownVisible ? styles.dropdownMenuActive : styles.dropdownMenu}>
                                <a className="dropdown-item" href="#" data-toggle="modal" data-target="#logoutModal" onClick={handleLogout}>
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" ></i>
                                    Sair
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

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
        </div>


        
    )
}

const styles = {
    expandbutton: {
        width: '10px',

    },

    //nav
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
        border: '2px solid yellow',
        margin: '5px',
        padding: '5px',
        borderRadius: '5px',
    },





    //salas
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
        // overflow: 'auto', // Adiciona a rolagem automática quando necessário
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
        marginTop: '30px',
        
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
