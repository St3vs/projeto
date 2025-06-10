import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditarProposta.css";
import "../styles/Sidebar.css";
import '../styles/Header.css';
import Sidebar from "../components/Sidebar";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { FaCheckCircle, FaPencilAlt } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import Header from "../components/Header";
import { apiUrl } from "../api";

const EditarProposta = () => {
   // useParams para obter o 'id' da URL (ex: /EditarProposta/3)
   const { id } = useParams();
   const navigate = useNavigate();

   // Estados para os campos do formulário
   const [cliente, setCliente] = useState('');
   const [contacto, setContacto] = useState('');
   const [assunto, setAssunto] = useState('');
   const [descricao, setDescricao] = useState('');
   const [data, setData] = useState('');
   const [valor, setValor] = useState('');
   const [estado, setEstado] = useState('');
   const [clienteId, setClienteId] = useState(null);

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const token = localStorage.getItem('token');

   const [editavel, setEditavel] = useState({
      assunto: false,
      descricao: false,
      valor: false,
      data: false,
      estado: false
   });

   useEffect(() => {
      const fetchProposta = async () => {
         try {
               //const response = await axios.get(`http://localhost:4000/propostas/listarProposta/${id}`, { 
               const response = await axios.get(`${apiUrl}/propostas/listarProposta/${id}`, {   
                  headers: { Authorization: `Bearer ${token}` }
               });
               
               const proposta = response.data;

               if (proposta.cliente) {
                  setCliente(proposta.cliente.username || '');
                  setContacto(proposta.cliente.contacto || '');
               } else {
                  setCliente('N/A');
                  setContacto('N/A');
               }
               
               setClienteId(proposta.clienteId);
               setAssunto(proposta.assunto || '');
               setDescricao(proposta.descricao || '');
               setValor(proposta.valor || '');
               setEstado(proposta.estado || '');
               setData(proposta.data ? new Date(proposta.data).toISOString().split('T')[0] : '');

         } catch (error) {
               console.error("Erro ao buscar dados da proposta:", error);
               alert("Não foi possível carregar os dados da proposta.");
         }
      };

      fetchProposta();
   }, [id, token]);

   // Função para submeter as alterações
   const handleAtualizarProposta = async (e) => {
      e.preventDefault();

      try {
         const response = await axios.put(
               //`http://localhost:4000/propostas/atualizarProposta/${id}`,
               `${apiUrl}/propostas/atualizarProposta/${id}`,
               {
                  clienteId, // Envia o clienteId para manter a associação
                  assunto,
                  descricao,
                  data,
                  valor,
                  estado
               },
               {
                  headers: { Authorization: `Bearer ${token}` }
               }
         );

         if (response.status === 200) {
               alert('Proposta atualizada com sucesso!');
               navigate('/Propostas'); // Volta para a lista de propostas
         }
      } catch (error) {
         console.error('Erro ao atualizar proposta:', error);
         alert('Erro ao tentar atualizar a proposta.');
      }
   };

   const estados = [
      { label: "Aceite", value: "Aceite", icon: <FaCheckCircle style={{ color: "green" }} /> },
      { label: "Pendente", value: "Pendente", icon: <MdAccessTimeFilled style={{ color: "yellow" }} /> },
      { label: "Recusada", value: "Recusada", icon: <FaCircleXmark style={{ color: "red" }} /> },
   ];
   
   const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

   const toggleEdit = (campo) => {
      setEditavel((prevState) => ({ ...prevState, [campo]: !prevState[campo] }));
   };

   const handleChange = (event) => {
      setProposta({ ...proposta, [event.target.name]: event.target.value });
   };

   return (
      <div className="paginas-sidebar">
         <Header toggleSidebar={toggleSidebar} />
         {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         <div className="paginas-sidebar-content">
               <div className='header-section'>
                  <div className='historico'>
                     <button className='voltarHome' onClick={() => navigate('/homepage')}><FaHouse /></button>
                     <MdOutlineKeyboardArrowRight />
                     <button className='voltarHome' onClick={() => navigate('/Propostas')}>PROPOSTAS</button>
                     <MdOutlineKeyboardArrowRight />
                     <h2>Editar Proposta {id}</h2>
                  </div>
               </div>

               <form className='inserir-novo' onSubmit={handleAtualizarProposta}>
                  <h1>Editar Proposta</h1>
                  <h4>Dados do cliente:</h4>
                  <div className="form-row">
                     <div className="form-group">
                        <label htmlFor="cliente">Nome do Cliente:</label>
                        <input type="text" id="cliente" value={cliente} disabled />
                     </div>
                     <div className="form-group">
                        <label htmlFor="cliente">Contacto do Cliente:</label>
                        <input type="text" id="cliente" value={contacto} disabled />
                     </div>
                  </div>

                  <h4>Detalhes da proposta:</h4>
                  <div className="form-group">
                     <div className="input-container">
                        <label htmlFor="assunto">Assunto:</label>
                        <div className="input-wrapper">
                           <input type="text" id="assunto" value={assunto} onChange={(e) => setAssunto(e.target.value)} disabled={!editavel.assunto} required />
                           <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("assunto")} />
                        </div>
                     </div>
                  </div>
                  <div className="form-group">
                     <div className="input-container">
                        <label htmlFor="descricao">Descrição:</label>
                        <div className="input-wrapper">
                           <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} disabled={!editavel.descricao} required />
                           <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("descricao")} />
                        </div>
                     </div>
                  </div>
                  <div className="form-row">
                     <div className="form-group">
                        <div className="input-container">
                           <label htmlFor="data">Data:</label>
                           <div className="input-wrapper">
                              <input type="date" name="data" value={data} onChange={(e) => setData(e.target.value)} disabled={!editavel.data} required />
                              <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("data")} />
                           </div>
                        </div>
                     </div>
                     <div className="form-group">
                        <div className="input-container">
                           <label htmlFor="valor">Valor:</label>
                           <div className="input-wrapper">
                              <input type="text" id="valor" value={valor} onChange={(e) => setValor(e.target.value)} disabled={!editavel.valor} required />
                              <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("valor")} />
                           </div>
                        </div>
                     </div>
                     <div className="form-group">
                        <label htmlFor="estado">Estado:</label>
                        <div className="select-container">
                           <select id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} required>
                              <option value="" disabled>Selecione o estado</option>
                              {estados.map((est) => (
                                 <option key={est.value} value={est.value}>{est.label}</option>
                              ))}
                           </select>
                           <span className="select-icon">
                              {estados.find(item => item.value === estado)?.icon || <MdOutlineKeyboardArrowDown />}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="buttons">
                     <button type="submit" className="save"><FaCheckCircle /> GUARDAR ALTERAÇÕES</button>
                     <button type="button" className="cancel" onClick={() => navigate('/Propostas')}><FaCircleXmark /> CANCELAR</button>
                  </div>
               </form>
         </div>
      </div>
   );
};

export default EditarProposta;
