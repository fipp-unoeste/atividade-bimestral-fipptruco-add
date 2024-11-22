'use client'

const { useState, createContext } = require("react")

const UserContext = createContext();

export const UserProvider = ({children}) => {
    const usuarioArmazenado = typeof window !== "undefined" ? localStorage.getItem("usuario") : null;

    let usuario = null;
    // if(localStorage.getItem('usuario') != null)
    //     usuario = JSON.parse(localStorage.getItem("usuario"));

    if (usuarioArmazenado) {
        try {
            usuario = JSON.parse(usuarioArmazenado);
        } catch (error) {
            console.error("Erro ao carregar usuário do localStorage:", error);
        }
    }
    
    const [user, setUser] = useState(usuario);

    return <UserContext.Provider value={{user, setUser}}>
                {children}
            </UserContext.Provider>
}

export default UserContext;





    

   
