import { createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const savedToken = getCookie('token');
        if (savedToken) {
            setToken(savedToken);
            console.log("Token carregado do cookie:", savedToken);
        } else {
            console.log("Nenhum token encontrado no cookie.");
        }
    }, []);

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const login = (token) => {
        console.log("Entrou no login AuthContext");
        setToken(token);
        document.cookie = `token=${token}; path=/; SameSite=Lax; Secure`;
        console.log("Usuário logado com token:", token);
    };

    const logout = () => {
        document.cookie = 'token=; Max-Age=0; path=/; SameSite=Lax; Secure';
        setToken(null);
        console.log("Usuário deslogado.");
        router.push('/login'); 
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    console.log('context:', context);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
