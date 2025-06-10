import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from "../components/Sidebar";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import '../styles/Formularios.css';
import "../styles/Sidebar.css";
import Header from "../components/Header";
import { apiUrl } from "../api";

const CriarFichaFornecedor = () => {
   const [username, setUser] = useState('');
   const [email, setEmail] = useState('');
   const [contacto, setContacto] = useState('');
   const [nif, setNIF] = useState('');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const navigate = useNavigate();

   const voltarHome = () => {
      navigate('/homepage');
   };

   const voltarFornecedores = () => {
      navigate('/Fornecedores');
   };

   const handleCriarFicha = async (e) => {
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
         const token = localStorage.getItem('token'); 

         //const response = await axios.post('http://localhost:4000/fornecedores/criarFichaFornecedor', {
         const response = await axios.post(`${apiUrl}/fornecedores/criarFichaFornecedor`, {
            username,
            email,
            contacto,
            nif
         }, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });
   
         if (response.status === 201) {
            alert('Ficha de fornecedor criada com sucesso!');
         }
      } catch (error) {
         if (error.response) {
            console.error('Erro do backend:', error.response.data);
            alert(error.response.data.error);
         } else {
            console.error('Erro de rede ou outro erro:', error);
            alert('Ocorreu um erro ao tentar criar ficha de fornecedor. Tente novamente.');
         }
      }
   };

   const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
   };

   return (
      <div className="inserir">

         <Header toggleSidebar={toggleSidebar}/>
         {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         <div className='content-formulario'>
               <div className='header-section'>
                  <div className='historico'>
                     <button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
                     <MdOutlineKeyboardArrowRight />
                     <button className='voltarHome' onClick={voltarFornecedores}>FORNECEDORES</button>
                     <MdOutlineKeyboardArrowRight />
                     <h2>Criar Ficha de Fornecedor</h2>
                  </div>
               </div>
               <div>
                  <form className='inserir-novo-fornecedores' onSubmit={handleCriarFicha}>
                     <h1>Criar Ficha de Fornecedor</h1>
                     <div className="form-group">
                        <label htmlFor="nome">Nome do Fornecedor:</label>
                        <input 
                           type="text" 
                           id="nome" 
                           name="nome" 
                           placeholder="Insira o nome"
                           value={username}
                           onChange={(e) => setUser(e.target.value)}
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input 
                           type="email" 
                           id="email" 
                           name="email" 
                           placeholder="Insira o Email" 
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                        />
                     </div>

                     <div className="form-group">
                        <label htmlFor="contacto">Contacto:</label>
                        <input 
                           type="text" 
                           id="contacto" 
                           name="contacto" 
                           placeholder="Insira o contacto"
                           value={contacto}
                           onChange={(e) => {
                                 const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                                 setContacto(value);
                           }} 
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="nif">NIF:</label>
                        <input 
                           type="text" 
                           id="nif" 
                           name="nif" 
                           placeholder="Insira o NIF" 
                           value={nif}
                           onChange={(e) => {
                                 const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                                 setNIF(value);
                           }}
                        />
                     </div>
                     <div className="buttons">
                        <button type="submit" className="save"><FaCheckCircle /> GUARDAR</button>
                        <button type="button" className="cancel" onClick={voltarFornecedores}><FaCircleXmark /> CANCELAR</button>
                     </div>
                  </form>
               </div>
         </div>
      </div>
    );
};

export default CriarFichaFornecedor;