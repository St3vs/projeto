import React, { useState } from 'react';
import '../styles/Register.css'; 
import logo from '../images/logoEscuro.png';
import { FaCircleXmark } from "react-icons/fa6";
import { FiLogIn } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "../api/axiosConfig";

function Register() {
   const [username, setUser] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [contacto, setContacto] = useState('');
   const [nif, setNIF] = useState('');
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false); 

   const handleCancel = () => {
      navigate('/');
   };

   const handleRegister = async (e) => {
      e.preventDefault();

      if (contacto.replace(/\D/g, '').length !== 9) {
         alert("O contacto deve conter exatamente 9 dígitos.");
         return;
      }

      if (nif.length !== 9 || isNaN(nif)) {
         alert("O NIF deve conter exatamente 9 dígitos numéricos.");
         return;
      }

      try {
         const response = await axios.post('/auth/register', {
         username,
         email,
         password,
         contacto,
         nif,
         });

         if (response.status === 201) {
         alert('Registo realizado com sucesso! Verifique seu email.');
         navigate('/');
         }
      } catch (error) {
         if (error.response) {
         console.error('Erro do backend:', error.response.data);
         alert(error.response.data.error);
         } else {
         console.error('Erro de rede ou outro erro:', error);
         alert('Ocorreu um erro ao tentar registar. Tente novamente.');
         }
      }
   };

   return (
      <div className="register-container">
         <h2 className="register-title">CRIAR CONTA</h2>
         <div className="register-content">
               <div className="register-left">
                  <img src={logo} alt="Logo" className="register-logo" />
                  <div className="app-name">FlowBiz</div>
               </div>
               <div className="register-right">
                  <form className="register-form" onSubmit={handleRegister}>
                     <input
                     type="text"
                     placeholder="Nome de utilizador"
                     value={username}
                     onChange={(e) => setUser(e.target.value)}
                     className="register-input"
                     required
                     />
                     <input
                     type="email"
                     placeholder="Email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="register-input"
                     required
                     />

                     <div className="password-container">
                           <input
                              type={showPassword ? "text" : "password"}
                              placeholder="Password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="register-input password-input"
                              required
                           />
                           <button
                              type="button"
                              className="toggle-password"
                              onClick={() => setShowPassword(!showPassword)}
                           >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                           </button>
                     </div>

                     <input
                           type="text"
                           placeholder="Contacto"
                           value={contacto}
                           onChange={(e) => {
                           const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                           setContacto(value);
                           }}
                           className="register-input"
                           required
                     />
                     <input
                           type="text"
                           placeholder="NIF"
                           value={nif}
                           onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                              setNIF(value);
                           }}
                           className="register-input"
                           required
                     />
                     <div className="buttons">
                           <button type="submit" className="save" ><FiLogIn />REGISTAR</button>
                           <button type="button" className="cancel" onClick={handleCancel}><FaCircleXmark />CANCELAR</button>
                     </div>
                  </form>
               </div>
         </div>
      </div>
   );
}

export default Register;