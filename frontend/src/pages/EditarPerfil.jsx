import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditarPerfil.css';
import Sidebar from '../components/Sidebar';
import { IoPerson } from 'react-icons/io5';
import iconUser from '../images/iconUser.png';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

const EditarPerfil = () => {
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

   const voltarConta = () => {
		navigate('/Conta');
	};

   return (
      <div className="editarperfil-container">
         <Sidebar />
         <div className='editarperfil-content'>
            <div className='editarperfil-header-section'>
               <div className='editarperfil-historico'>
                  <button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
                  <MdOutlineKeyboardArrowRight />
                  <button className='voltarConta' onClick={voltarConta}>CONTA</button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>Editar perfil</h2>
               </div>
            </div>
            {user ? (
               <div>
                  <div className="editarperfil-header">
                     <button onClick={voltarConta} className='editarperfil-conta-button' >
                        <IoPerson />
                        Dados Pessoais
                     </button>
                     <button onClick={handleEditProfile} className="editarperfil-editperfil-button">
                        Editar Dados do Perfil
                     </button>
                  </div>
                  <div className="editarperfil-conta-content">
                        <div className="editarperfil-conta-left">
                           <img src={iconUser} alt="iconUser" className="editarperfil-conta-logo" />
                        </div>
                        <div className="editarperfil-conta-right">
                           <div className="editarperfil-dados-pessoais">
                              <div className="editarperfil-dados">
                                 <strong>Nome</strong>
                                 <p>{user.username}</p>
                              </div>
                              <div className="editarperfil-dados">
                                 <strong>Email</strong>
                                 <p>{user.email}</p>
                              </div>
                              <div className="editarperfil-dados">
                                 <strong>Contacto</strong>
                                 <p>{user.contacto || "Não disponível"}</p>
                              </div>
                              <div className="editarperfil-dados">
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

export default EditarPerfil;