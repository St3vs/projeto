//AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

   useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
         try {
               setUser(JSON.parse(storedUser));
         } catch (err) {
               console.error("Erro ao fazer parse do utilizador:", err);
               localStorage.removeItem("user"); // limpa dados inválidos
         }
      }
   }, []);

    const login = (userData, token) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
