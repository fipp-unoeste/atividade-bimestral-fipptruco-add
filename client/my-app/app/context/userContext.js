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

    const logout = () => {
        setUser(null);
        localStorage.removeItem('usuario'); // Remove o usuário salvo

         // Remove todos os cookies configurados
         document.cookie.split(";").forEach((cookie) => {
            const [name] = cookie.split("=");
            document.cookie = `${name.trim()}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
        });

        console.log("Cookies e usuário removidos!");
    };

    return <UserContext.Provider value={{user, setUser, logout}}>
                {children}
            </UserContext.Provider>
}

export default UserContext;





    

   
