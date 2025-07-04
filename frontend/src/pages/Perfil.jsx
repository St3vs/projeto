import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Conta.css';
import Sidebar from '../components/Sidebar';
import { IoPerson } from 'react-icons/io5';
import iconUser from '../images/iconUser.png';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Header from "../components/Header";
import axios from 'axios';
import '../styles/Header.css';
import { apiUrl } from '../api';

const Conta = () => {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const token = localStorage.getItem('token');

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const res = await axios.get(`${apiUrl}/auth/user`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
         } catch (err) {
            console.error(err);
            navigate('/');
         }
      };
      if (token) {
         fetchUser();
      } else {
         navigate('/');
      }
   }, [navigate]);

   const handleEditProfile = () => {
      navigate('/Perfil/EditarPerfil');
   };

   const voltarHome = () => {
      navigate('/homepage');
   };

   const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
   };

   return (
      <div className="conta-container">

         <Header toggleSidebar={toggleSidebar}/>
         {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         <div className='conta-content'>
            <div className='header-section'>
               <div className='historico'>
                  <button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>PERFIL</h2>
               </div>
            </div>
            {user ? (
               <div>
                  <div className="conta-header">
                     <button className='conta-dadosPessoais-button' >
                        <IoPerson />
                        Dados Pessoais
                     </button>
                     <button onClick={handleEditProfile} className="conta-edit-button">
                        Editar Dados do Perfil
                     </button>
                  </div>
                  <div className="conta-conta-content">
                        <div className="conta-conta-left">
                           <img 
                             src={user.fotoPerfil ? user.fotoPerfil : iconUser} 
                             alt="Foto de perfil" 
                             className="conta-conta-logo" 
                           />
                        </div>
                        <div className="conta-conta-right">
                           <div className="conta-dados-pessoais">
                              <div className="conta-dados">
                                    <strong>Nome</strong>
                                    <p>{user.username}</p>
                              </div>
                              <div className="conta-dados">
                                    <strong>Email</strong>
                                    <p>{user.email}</p>
                              </div>
                              <div className="conta-dados">
                                    <strong>Contacto</strong>
                                    <p>{user.contacto || "Não disponível"}</p>
                              </div>
                              <div className="conta-dados">
                                    <strong>NIF</strong>
                                    <p>{user.nif || "Não disponível"}</p>
                              </div>
                           </div>
                        </div>
                  </div>
               </div>
            ) : (
               <p>Carregando dados...</p>
            )}
         </div>
      </div>
   );
};

export default Conta;
