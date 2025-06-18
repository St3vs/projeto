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
import { FaCheckCircle } from "react-icons/fa";
import '../styles/Header.css';
import axios from 'axios';
import { apiUrl } from '../api';
import ImageCropModal from './ImageCropModal';

const EditarPerfil = () => {
   const [user, setUser] = useState(null);
   const [form, setForm] = useState({ username: '', contacto: '', nif: '', fotoPerfil: '' });
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const token = localStorage.getItem('token');
   const [selectedImage, setSelectedImage] = useState(null);
   const [showCropModal, setShowCropModal] = useState(false);

   useEffect(() => {
      const fetchUser = async () => {
         try {
            const res = await axios.get(`${apiUrl}/auth/user`, {
               headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data.user);
            setForm({
               username: res.data.user.username,
               contacto: res.data.user.contacto || '',
               nif: res.data.user.nif || '',
               fotoPerfil: res.data.user.fotoPerfil || ''
            });
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
         navigate("/Perfil");
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
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         navigate('/');
      } catch (error) {
         console.error(error);
         alert(error.response?.data?.error || 'Erro ao eliminar a conta.');
      }
   };

   const handleEditProfile = () => navigate('/Perfil/EditarPerfil');
   const voltarHome = () => navigate('/homepage');
   const voltarConta = () => navigate('/Perfil');
   const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

   const handleImageUpload = async (file) => {
      const formData = new FormData();
      formData.append('image', file);

      try {
         const res = await axios.post(`${apiUrl}/auth/fotoPerfil`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            }
         });

         const imageUrl = res.data.url;
         setUser(prev => ({ ...prev, fotoPerfil: imageUrl }));
         setForm(prev => ({ ...prev, fotoPerfil: imageUrl }));
         localStorage.setItem('user', JSON.stringify({ ...user, fotoPerfil: imageUrl }));
      } catch (err) {
         console.error(err);
         alert('Erro ao carregar imagem');
      }
   };

   const handleImageSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setSelectedImage(reader.result);
            setShowCropModal(true);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleCroppedImage = async (croppedBlob) => {
      const formData = new FormData();
      formData.append('image', croppedBlob);

      try {
         const res = await axios.post(`${apiUrl}/auth/fotoPerfil`, formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
               Authorization: `Bearer ${token}`,
            }
         });

         const imageUrl = res.data.url;
         setUser(prev => ({ ...prev, fotoPerfil: imageUrl }));
         setForm(prev => ({ ...prev, fotoPerfil: imageUrl }));
         localStorage.setItem('user', JSON.stringify({ ...user, fotoPerfil: imageUrl }));
      } catch (err) {
         console.error(err);
         alert('Erro ao carregar imagem');
      }
   };
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
                  <button className='voltarHome' onClick={voltarConta}>PERFIL</button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>Editar perfil</h2>
               </div>
            </div>

            {user ? (
               <div>
                  <div className="editarperfil-header">
                     <button onClick={voltarConta} className='editarperfil-conta-button'>
                        <IoPerson /> Dados Pessoais
                     </button>
                     <button onClick={handleEditProfile} className="editarperfil-editperfil-button">
                        Editar Dados do Perfil
                     </button>
                  </div>

                  <form onSubmit={handleSubmit} className="editarperfil-conta-content">
                  <div className="editarperfil-conta-left">
                     {form.fotoPerfil ? (
                     <img
                        src={form.fotoPerfil}
                        alt="Foto de Perfil"
                        className="editarperfil-conta-logo"
                     />
                     ) : (
                        <img
                           src={iconUser}
                           alt="Sem foto"
                           className="editarperfil-conta-logo"
                        />
                     )}
                     <input type="file" accept="image/*" onChange={handleImageSelect} />
                     {showCropModal && selectedImage && (
                        <ImageCropModal
                           image={selectedImage}
                           onClose={() => {
                              setShowCropModal(false);
                              setSelectedImage(null); 
                           }}
                           onCropComplete={handleCroppedImage}
                        />
                     )}
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
