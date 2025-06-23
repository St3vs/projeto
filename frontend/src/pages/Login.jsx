//login.jsx
import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import logo from "../images/logoEscuro.png";
import { FaCircleXmark } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../api";

function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [lembrarMe, setLembrarMe] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      const rememberedData = localStorage.getItem("rememberMe");
      if (rememberedData) {
         const { email, password } = JSON.parse(rememberedData);
         setEmail(email);
         setPassword(password);
         setLembrarMe(true);
      }
   }, []);

   const handleLogin = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post(`${apiUrl}/auth/login`, {  
            email,
            password,
         });

         if (response.status === 200) {
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            if (lembrarMe) {
            localStorage.setItem("rememberMe", JSON.stringify({ email, password }));
            } else {
            localStorage.removeItem("rememberMe");
            }

            navigate("/homepage");
         }
      } catch (error) {
         alert(error.response?.data?.error || "Erro ao fazer login");
      }
   };


   return (
      <div className="login-container">
         <h2 className="login-title">LOGIN</h2>
         <div className="login-content">
         <div className="login-left">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="app-name">FlowBiz</div>
         </div>
         <div className="login-right">
            <form className="login-form" onSubmit={handleLogin}>
               <input
               type="email"
               placeholder="Utilizador"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="login-input"
               required
               />
               <input
               type="password"
               placeholder="************"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="login-input"
               required
               />
               <div className="lembrar-depois">
               <div className="lembrar">
                  <input
                     type="checkbox"
                     id="lembrar"
                     checked={lembrarMe}
                     onChange={(e) => setLembrarMe(e.target.checked)}
                  />
                  <label htmlFor="lembrar">Lembrar-me</label>
               </div>
               <a href="/esquecerSenha" className="forgot-password">
                  Esqueceu-se da palavra-passe?
               </a>
               </div>
               <div className="buttons-login">
               <button type="submit" className="save">
                  <FiLogIn />
                  ENTRAR
               </button>
               </div>
            </form>
            <p className="create-account">
               Ainda não tem conta? <a href="/Register">Criar Conta</a>
            </p>
         </div>
         </div>
      </div>
   );
}

export default Login;
