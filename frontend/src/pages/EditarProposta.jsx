import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../styles/EditarProposta.css";
import "../styles/Sidebar.css";
import Sidebar from "../components/Sidebar";
import { MdOutlineKeyboardArrowRight, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { FaCheckCircle, FaPencilAlt } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import Header from "../components/Header";
import '../styles/Header.css';

function EditarProposta() {
   const { id } = useParams(); 
   const navigate = useNavigate();
   const [estado, setEstado] = useState('');
   const [proposta, setProposta] = useState({
      cliente: "",
      contacto: "",
      assunto: "",
      descricao: "",
      data: "",
      valor: "",
      estado: ""
   });

   const [editavel, setEditavel] = useState({
      assunto: false,
      descricao: false,
      valor: false,
      data: false
   });
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   

   useEffect(() => {
      const fetchProposta = async () => {
         try {
            const response = await axios.get(`http://localhost:4000/propostas/listarProposta/${id}`);
            const dados = response.data;

            // Ajustar formato da data para YYYY-MM-DD se necessário
            if (dados.data) {
               dados.data = dados.data.split("T")[0];
            }

            setProposta(dados);
         } catch (error) {
            console.error("Erro ao buscar proposta:", error);
         }
      };

      fetchProposta();
   }, [id]);

   const handleChange = (event) => {
      setProposta({ ...proposta, [event.target.name]: event.target.value });
   };

   const toggleEdit = (campo) => {
      setEditavel((prevState) => ({ ...prevState, [campo]: !prevState[campo] }));
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      try {
         await axios.put(`http://localhost:4000/propostas/atualizarProposta/${id}`, proposta);
         alert("Proposta atualizada com sucesso!");
         navigate("/Propostas");
      } catch (error) {
         console.error("Erro ao atualizar proposta:", error);
         alert("Erro ao atualizar proposta.");
      }
   };

   const estados = [
      { label: "Aceite ", value: "Aceite", icon: <FaCheckCircle style={{ color: "green" }} /> },
      { label: "Pendente", value: "Pendente", icon: <MdAccessTimeFilled style={{ color: "yellow" }} /> },
      { label: "Recusada", value: "Recusada", icon: <FaCircleXmark style={{ color: "red" }} /> },
   ];

   const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
   };

   return (
      <div className="editar-proposta">

         <Header toggleSidebar={toggleSidebar}/>
         {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         <div className="proposta-content">
            <div className='header-section'>
               <div className='historicoEditarProposta'>
                  <button className='voltarHome' onClick={() => navigate('/homepage')}><FaHouse /></button>
                  <MdOutlineKeyboardArrowRight />
                  <button className='voltarHome' onClick={() => navigate('/Propostas')}>PROPOSTAS</button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>Detalhes da Proposta</h2>
               </div>
            </div>

            <div>
               {!proposta.cliente ? ( 
                  <p>Carregar dados...</p>
               ) : (
                  <form className="atualizar-proposta" onSubmit={handleSubmit}>
                     <h1>Detalhes da Proposta</h1>
                     <h4>Dados do cliente:</h4>
                     <div className="form-row-editarproposta">
                        <div className="form-group-editarproposta">
                           <label>Cliente:</label>
                           <input type="text" name="cliente" value={proposta.cliente} disabled />
                        </div>

                        <div className="form-group-editarproposta">
                           <label>Contacto:</label>
                           <input type="text" name="contacto" value={proposta.contacto} disabled />
                        </div>
                     </div>

                     <h4>Dados da proposta:</h4>

                     <div className="form-group-editarproposta">
                        <label>Assunto:</label>
                        <div className="input-container">
                           <input type="text" name="assunto" value={proposta.assunto} onChange={handleChange} disabled={!editavel.assunto} required />
                           <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("assunto")} />
                        </div>
                     </div>

                     <div className="form-group-editarproposta">
                        <label>Descrição:</label>
                        <div className="input-container">
                           <textarea name="descricao" value={proposta.descricao} onChange={handleChange} disabled={!editavel.descricao} required />
                           <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("descricao")} />
                        </div>
                     </div>

                     <div className="form-row-editarproposta">
                        <div className="form-group-editarproposta">
                           <label>Data:</label>
                           <div className="input-container">
                              <input type="date" name="data" value={proposta.data || ''} onChange={handleChange} disabled={!editavel.data} required />
                              <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("data")} />
                           </div>
                        </div>

                        <div className="form-group-editarproposta">
                           <label>Valor(€):</label>
                           <div className="input-container">
                              <input type="number" name="valor" value={proposta.valor} onChange={handleChange} disabled={!editavel.valor} required className="input2"/>
                              <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("valor")} />
                           </div>
                        </div>
                        <div className="form-group-editarproposta">
                           
                           <label>Estado:</label>

                           <div className="select-container-editarProposta">
                              <select
                                 id="estado"
                                 name="estado"
                                 value={estado}
                                 onChange={(e) => setEstado(e.target.value)}
                              >
                                 <option value="" disabled hidden>Selecione o estado</option>
                                 {estados.map((estado) => (
                                    <option key={estado.value} value={estado.value}>
                                       {estado.label}
                                    </option>
                                 ))}
                              </select>
                              <span className="select-icon">
                                 {estados.find((item) => item.value === estado)?.icon || <MdOutlineKeyboardArrowDown />}
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="buttons">
                        <button type="submit" className="save"><FaCheckCircle /> Guardar Alterações</button>
                        <button type="button" className="cancel" onClick={() => navigate('/Propostas')}><FaCircleXmark /> Cancelar</button>
                     </div>
                  </form>
               )}
            </div>
         </div>
      </div>
   );
}

export default EditarProposta;
