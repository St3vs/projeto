import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/EditarPerfil.css';
import '../styles/index.css';
import Sidebar from '../components/Sidebar';
import { IoPerson } from 'react-icons/io5';
import iconUser from '../images/iconUser.png';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Header from "../components/Header";
import { FaCheckCircle} from "react-icons/fa";
import '../styles/Header.css';
import axios from 'axios';
import { apiUrl } from '../api';

const EditarPerfil = () => {
   const [user, setUser] = useState(null);
   const [form, setForm] = useState({ username: '', contacto: '', nif: '' });
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const token = localStorage.getItem('token');
   
   useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!token || !userData) {
         navigate('/');
      } else {
         setUser(userData);
         setForm({
            username: userData.username,
            contacto: userData.contacto || '',
            nif: userData.nif || ''
         });
      }
   }, [navigate]);

   const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.put(`${apiUrl}/auth/atualizarPerfil`, form, {
            headers: { Authorization: `Bearer ${token}` }
         });

         localStorage.setItem("user", JSON.stringify(response.data.user));
         setUser(response.data.user);
         alert("Perfil atualizado com sucesso!");
         navigate("/Conta");
      } catch (error) {
         console.error(error);
         alert("Erro ao atualizar o perfil.");
      }
   };

   const deleteAccount = async () => {
      try {
         const response = await axios.delete(`${apiUrl}/auth/eliminarConta`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         alert(response.data.message || 'Conta eliminada com sucesso.');

         // Limpar localStorage e redirecionar para login ou página inicial
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         navigate('/');
      } catch (error) {
         console.error(error);
         alert(error.response?.data?.error || 'Erro ao eliminar a conta.');
      }
   };

   const handleEditProfile = () => {
      navigate('/Conta/EditarPerfil');
   };

   const voltarHome = () => navigate('/homepage');
   const voltarConta = () => navigate('/Conta');
   const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

   return (
      <div className="editarperfil-container">
         <Header toggleSidebar={toggleSidebar} />
         {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         <div className='editarperfil-content'>
            <div className='header-section'>
               <div className='historico'>
                  <button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
                  <MdOutlineKeyboardArrowRight />
                  <button className='voltarHome' onClick={voltarConta}>CONTA</button>
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

                  <form onSubmit={handleSubmit} className="editarperfil-conta-content">
                     <div className="editarperfil-conta-left">
                        <img src={iconUser} alt="iconUser" className="editarperfil-conta-logo" />
                     </div>
                     <div className="editarperfil-conta-right">
                        <div className="editarperfil-dados-pessoais">
                           <div className="editarperfil-dados">
                              <label><strong>Nome</strong></label>
                              <p><input
                                 type="text"
                                 name="username"
                                 value={form.username}
                                 onChange={handleChange}
                                 required
                              /></p>
                           </div>
                           <div className="editarperfil-dados">
                              <label><strong>Email</strong></label>
                              <p>{user.email}</p>
                           </div>
                           <div className="editarperfil-dados">
                              <label><strong>Contacto</strong></label>
                              <p><input
                                 type="text"
                                 name="contacto"
                                 value={form.contacto}
                                 onChange={handleChange}
                              /></p>
                           </div>
                           <div className="editarperfil-dados">
                              <label><strong>NIF</strong></label>
                              <p><input
                                 type="text"
                                 name="nif"
                                 value={form.nif}
                                 onChange={handleChange}
                              /></p>
                           </div>
                        </div>
                        <div className="buttons">
                           <button type="submit" className="save"><FaCheckCircle /> Guardar Alterações</button>
                           <button
                              type="button"
                              className="cancel"
                              onClick={() => {
                                 if (window.confirm('Tem certeza que deseja eliminar a sua conta? Esta ação é irreversível.')) {
                                    deleteAccount();
                                 }
                              }}
                              >
                           Eliminar Conta
                        </button>
                        </div>
                     </div>
                  </form>
               </div>
            ) : (
               <p>Carregando dados...</p>
            )}
         </div>
      </div>
   );
};

export default EditarPerfil;
