import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaPencilAlt, FaCheckCircle} from "react-icons/fa";
import { FaCircleXmark, FaHouse} from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "../styles/Sidebar.css";
import "../styles/Header.css";
import "../styles/EditarProposta.css";
import { apiUrl } from "../api";

function EditarObra() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [obra, setObra] = useState({
      projetoAssunto: "",
      projetoClienteId: "",
      descricao: "",
      data: "",
      valorProposta: "",
      valorFaturado: "",
      dataUltimaFatura: ""
   });

   const [editavel, setEditavel] = useState({
      descricao: false,
      data: false,
      valorProposta: false,
      valorFaturado: false,
      dataUltimaFatura: false
   });

   useEffect(() => {
      const fetchObra = async () => {
         try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${apiUrl}/obras/listarObra/${id}`, { 
               headers: { Authorization: `Bearer ${token}` }
            });
            const dados = response.data;

            if (dados.data) {
               dados.data = dados.data.split(/[T\s]/)[0]; 
            }
            if (dados.dataUltimaFatura) {
               dados.dataUltimaFatura = dados.dataUltimaFatura.split(/[T\s]/)[0];
            }

            setObra({
               projetoAssunto: dados.projeto?.assunto || '',
               projetoClienteId: dados.projeto?.clienteId || '',
               descricao: dados.descricao || '',
               data: dados.data || '',
               valorProposta: dados.valorProposta || '',
               valorFaturado: dados.valorFaturado || '',
               dataUltimaFatura: dados.dataUltimaFatura || ''
            });
         } catch (error) {
            console.error("Erro ao pesquisar obra:", error);
         }
      };

      fetchObra();
   }, [id]);

   const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
   };

   const handleChange = (event) => {
      setObra({ ...obra, [event.target.name]: event.target.value });
   };

   const toggleEdit = (campo) => {
      setEditavel((prev) => ({ ...prev, [campo]: !prev[campo] }));
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      try {
         const token = localStorage.getItem("token");

         const dataToSend = {
            descricao: obra.descricao,
            data: obra.data,
            valorProposta: obra.valorProposta,
            valorFaturado: obra.valorFaturado,
            dataUltimaFatura: obra.dataUltimaFatura,
         };

         await axios.put(`${apiUrl}/obras/atualizarObra/${id}`, dataToSend, {
            headers: { Authorization: `Bearer ${token}` }
         });

         alert("Obra atualizada com sucesso!");
         navigate("/Obras");
      } catch (error) {
         console.error("Erro ao atualizar obra:", error);
         alert("Erro ao atualizar obra.");
      }
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
                  <button className='voltarHome' onClick={() => navigate('/Obras')}>OBRAS</button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>Editar Obra</h2>
               </div>
            </div>

            <form className="atualizar-proposta" onSubmit={handleSubmit}>
               <h1>Editar Obra</h1>
               
               <h4>Dados do Projeto Associado a Esta obra:</h4>
               <div className="form-row">
                  <div className="form-group">
                     <label>Projeto:</label>
                     <input type="text" name="projetoAssunto" value={obra.projetoAssunto} disabled />
                  </div>

                  <div className="form-group">
                     <label>ID Cliente do Projeto:</label>
                     <input type="text" name="projetoClienteId" value={obra.projetoClienteId} disabled />
                  </div>
               </div>

               <div className="form-group">
                  <label>Descrição da Obra:</label>
                  <div className="input-wrapper">
                     <textarea name="descricao" value={obra.descricao} onChange={handleChange} disabled={!editavel.descricao} className={editavel.descricao ? "input-editing" : ""}/>
                     <FaPencilAlt className={`edit-icon ${editavel.descricao ? "edit-icon-active" : ""}`} onClick={() => toggleEdit("descricao")} />
                  </div>
               </div>

               <div className="form-row">
                  <div className="form-group">
                     <label>Data:</label>
                     <div className="input-wrapper">
                        <input type="date" name="data" value={obra.data || ""} onChange={handleChange} disabled={!editavel.data} className={editavel.data ? "input-editing" : ""}/>
                        <FaPencilAlt className={`edit-icon ${editavel.data ? "edit-icon-active" : ""}`} onClick={() => toggleEdit("data")} />
                     </div>
                  </div>

                  <div className="form-group">
                     <label>Valor Proposta (€):</label>
                     <div className="input-wrapper">
                        <input type="number" name="valorProposta" value={obra.valorProposta} onChange={handleChange} disabled={!editavel.valorProposta} className={editavel.valorProposta ? "input-editing" : ""}/>
                        <FaPencilAlt className={`edit-icon ${editavel.valorProposta ? "edit-icon-active" : ""}`} onClick={() => toggleEdit("valorProposta")} />
                     </div>
                  </div>
               </div>

               <div className="form-row">
                  <div className="form-group">
                     <label>Valor Faturado (€):</label>
                     <div className="input-wrapper">
                        <input type="number" name="valorFaturado" value={obra.valorFaturado} onChange={handleChange} disabled={!editavel.valorFaturado} className={editavel.valorFaturado ? "input-editing" : ""}/>
                        <FaPencilAlt className={`edit-icon ${editavel.valorFaturado ? "edit-icon-active" : ""}`} onClick={() => toggleEdit("valorFaturado")} />
                     </div>
                  </div>

                  <div className="form-group">
                     <label>Data Última Fatura:</label>
                     <div className="input-wrapper">
                        <input type="date" name="dataUltimaFatura" value={obra.dataUltimaFatura || ""} onChange={handleChange} disabled={!editavel.dataUltimaFatura} className={editavel.dataUltimaFatura ? "input-editing" : ""}/>
                        <FaPencilAlt className={`edit-icon ${editavel.dataUltimaFatura ? "edit-icon-active" : ""}`} onClick={() => toggleEdit("dataUltimaFatura")} />
                     </div>
                  </div>
               </div>

               <div className="buttons">
                  <button type="submit" className="save"><FaCheckCircle /> Guardar Alterações</button>
                  <button type="button" className="cancel" onClick={() => navigate('/Obras')}><FaCircleXmark /> Cancelar</button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default EditarObra;