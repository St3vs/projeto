import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Conta.css';
import Sidebar from '../components/Sidebar';
import { IoPerson } from 'react-icons/io5';
import iconUser from '../images/iconUser.png';

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
      navigate('/EditarPerfil'); // Redireciona para a página de edição
   };

   return (
      <div className="conta-container">
         <Sidebar />
         <div className='clientes-content'>
            {user ? (
               <div>
                  <div className="header">
                        <button className='dadosPessoais-button'>
                           <IoPerson />
                           Dados Pessoais
                        </button>
                        <button onClick={handleEditProfile} className="edit-button">
                           Editar Dados do Perfil
                        </button>
                  </div>
                  <div className="conta-content">
                        <div className="conta-left">
                           <img src={iconUser} alt="iconUser" className="conta-logo" />
                        </div>
                        <div className="conta-right">
                           <div className="dados-pessoais">
                              <div className="dados">
                                    <strong>Nome</strong>
                                    <p>{user.username}</p>
                              </div>
                              <div className="dados">
                                    <strong>Email</strong>
                                    <p>{user.email}</p>
                              </div>
                              <div className="dados">
                                    <strong>Contacto</strong>
                                    <p>{user.contacto || "Não disponível"}</p>
                              </div>
                              <div className="dados">
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