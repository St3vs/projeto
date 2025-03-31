import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Conta.css';
import Sidebar from '../components/Sidebar';
import { IoPerson } from 'react-icons/io5';
import iconUser from '../images/iconUser.png';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const Conta = () => {
   const [user, setUser] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));
   
      if (!token || !userData) {
         navigate('/');
      } else {
         setUser(userData);
      }
   }, [navigate]);

   const handleEditProfile = () => {
      navigate('/Conta/EditarPerfil');
   };

   const voltarHome = () => {
		navigate('/homepage');
	};

   return (
      <div className="conta-container">
         <Sidebar />
         <div className='conta-content'>
            <div className='conta-header-section'>
               <div className='conta-historico'>
                  <button className='conta-voltarHome' onClick={voltarHome}><FaHouse /></button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>CONTA</h2>
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
                           <img src={iconUser} alt="iconUser" className="conta-conta-logo" />
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