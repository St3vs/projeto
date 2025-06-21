import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaPencilAlt, FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import "../styles/Sidebar.css";
import "../styles/Header.css";
import "../styles/EditarProposta.css";
import { apiUrl } from "../api";

function EditarEncomenda() {
   const { id } = useParams();
   const navigate = useNavigate();
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [encomenda, setEncomenda] = useState({
      fornecedor: "",
      contacto: "",
      clienteId: "",
      descricao: "",
      descricaoMaterial: "",
      data: "",
      previsaoEntrega: "",
      valor: "",
      observacoes: "",
      idObra: "",
   });

   const [editavel, setEditavel] = useState({
      descricaoMaterial: false,
      data: false,
      previsaoEntrega: false,
      valor: false,
      observacoes: false,
   });

   useEffect(() => {
      const fetchEncomenda = async () => {
         try {
         const token = localStorage.getItem("token");
         const response = await axios.get(
            //`http://localhost:4000/encomendas/listarEncomenda/${id}`,
            `${apiUrl}/encomendas/listarEncomenda/${id}`,
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         const dados = response.data;

         const formatarData = (dataISO) => {
            if (!dataISO) return "";
            const data = new Date(dataISO);
            const ano = data.getFullYear();
            const mes = String(data.getMonth() + 1).padStart(2, "0");
            const dia = String(data.getDate()).padStart(2, "0");
            return `${ano}-${mes}-${dia}`;
         };

         const dataFormatada = formatarData(dados.data);
         const previsaoFormatada = formatarData(dados.previsaoEntrega);

         // Extrair campos aninhados do fornecedor, obra e cliente
         setEncomenda({
            fornecedor: dados.fornecedor?.username || "",
            contacto: dados.fornecedor?.contacto || "",
            clienteId: dados.obra?.projeto?.clienteId || "",
            descricao: dados.obra?.descricao || "",
            descricaoMaterial: dados.descricaoMaterial || "",
            data: dataFormatada,
            previsaoEntrega: previsaoFormatada,
            valor: dados.valor || "",
            observacoes: dados.observacoes || "",
            idObra: dados.obra?.id || "",
         });
         } catch (error) {
         console.error("Erro ao pesquisar encomenda:", error);
         }
      };

      fetchEncomenda();
   }, [id]);

   const toggleSidebar = () => {
      setIsSidebarOpen((prev) => !prev);
   };

   const handleChange = (event) => {
      setEncomenda({ ...encomenda, [event.target.name]: event.target.value });
   };

   const toggleEdit = (campo) => {
      setEditavel((prev) => ({ ...prev, [campo]: !prev[campo] }));
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      try {
         const token = localStorage.getItem("token");

         // Prepare os dados que realmente vão ser enviados ao backend
         const dadosAtualizados = {
            descricaoMaterial: encomenda.descricaoMaterial,
            data: encomenda.data,
            previsaoEntrega: encomenda.previsaoEntrega,
            valor: encomenda.valor,
            observacoes: encomenda.observacoes,
         };

         await axios.put(
         //`http://localhost:4000/encomendas/atualizarEncomenda/${id}`,
         `${apiUrl}/encomendas/atualizarEncomenda/${id}`,
         dadosAtualizados,
         {
            headers: { Authorization: `Bearer ${token}` },
         }
         );
         alert("Encomenda atualizada com sucesso!");
         navigate("/Encomendas");
      } catch (error) {
         console.error("Erro ao atualizar encomenda:", error);
         alert("Erro ao atualizar encomenda.");
      }
   };

   return (
      <div className="paginas-sidebar">
         <Header toggleSidebar={toggleSidebar} />
         {isSidebarOpen && (
         <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
         )}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

         <div className="paginas-sidebar-content">
         <div className="header-section">
            <div className="historico">
               <button className="voltarHome" onClick={() => navigate("/homepage")}>
               <FaHouse />
               </button>
               <MdOutlineKeyboardArrowRight />
               <button className="voltarHome" onClick={() => navigate("/Encomendas")}>
               Encomendas
               </button>
               <MdOutlineKeyboardArrowRight />
               <h2>Editar Encomenda</h2>
            </div>
         </div>

            <form className="inserir-novo" onSubmit={handleSubmit}>
               <h1>Editar Encomenda</h1>

               <div className="form-row-encomendas">
                  <div>
                     <h4>Dados do Fornecedor associado:</h4>
                     <div className="form-row"> 
                        <div className="form-group">
                           <label>Fornecedor:</label>
                           <input type="text" name="fornecedor" value={encomenda.fornecedor} disabled />
                        </div>
                        <div className="form-group">
                           <label>Contacto:</label>
                           <input type="text" name="contacto" value={encomenda.contacto} disabled />
                        </div>
                     </div>
                  </div>

                  <div>
                     <h4>Dados da Obra associada:</h4>
                     <div className="form-row"> 
                        <div className="form-group">
                           <label>Id da obra:</label>
                           <input type="text" name="idObra" value={encomenda.idObra} disabled />
                        </div>
                        <div className="form-group">
                           <label>Id do Cliente:</label>
                           <input type="text" name="cliente" value={encomenda.clienteId} disabled />
                        </div>
                        <div className="form-group">
                           <label>Descrição da Obra:</label>
                           <input type="text" name="descricao" value={encomenda.descricao} disabled />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="form-group">
               <label>Descrição do Material:</label>
               <div className="input-wrapper">
                  <textarea
                     name="descricaoMaterial"
                     value={encomenda.descricaoMaterial}
                     onChange={handleChange}
                     disabled={!editavel.descricaoMaterial}
                     className={editavel.descricaoMaterial ? "input-editing" : ""}
                  />
                  <FaPencilAlt
                     className={`edit-icon ${editavel.descricaoMaterial ? "edit-icon-active" : ""}`}
                     onClick={() => toggleEdit("descricaoMaterial")}
                  />
               </div>
               </div>

               <div className="form-row">
               <div className="form-group">
                  <label>Data:</label>
                  <div className="input-wrapper">
                     <input
                     type="date"
                     name="data"
                     value={encomenda.data || ""}
                     onChange={handleChange}
                     disabled={!editavel.data}
                     className={editavel.data ? "input-editing" : ""}
                     />
                     <FaPencilAlt 
                        className={`edit-icon ${editavel.data ? "edit-icon-active" : ""}`} 
                        onClick={() => toggleEdit("data")} 
                     />
                  </div>
               </div>

               <div className="form-group">
                  <label>Previsão de entrega:</label>
                  <div className="input-wrapper">
                     <input
                     type="date"
                     name="previsaoEntrega"
                     value={encomenda.previsaoEntrega || ""}
                     onChange={handleChange}
                     disabled={!editavel.previsaoEntrega}
                     className={editavel.previsaoEntrega ? "input-editing" : ""}
                     />
                     <FaPencilAlt
                        className={`edit-icon ${editavel.previsaoEntrega ? "edit-icon-active" : ""}`}
                        onClick={() => toggleEdit("previsaoEntrega")}
                     />
                  </div>
               </div>

               <div className="form-group">
                  <label>Valor (€):</label>
                  <div className="input-wrapper">
                     <input
                     type="number"
                     name="valor"
                     value={encomenda.valor}
                     onChange={handleChange}
                     disabled={!editavel.valor}
                     className={editavel.valor ? "input-editing" : ""}
                     />
                     <FaPencilAlt 
                        className={`edit-icon ${editavel.data ? "edit-icon-active" : ""}`} 
                        onClick={() => toggleEdit("valor")} 
                     />
                  </div>
               </div>
               </div>

               <div className="form-row">
               <div className="form-group">
                  <label>Observações:</label>
                  <div className="input-wrapper">
                     <input
                     type="text"
                     name="observacoes"
                     value={encomenda.observacoes}
                     onChange={handleChange}
                     disabled={!editavel.observacoes}
                     className={editavel.valor ? "input-editing" : ""}
                     />
                     <FaPencilAlt 
                        className={`edit-icon ${editavel.observacoes ? "edit-icon-active" : ""}`}
                        onClick={() => toggleEdit("observacoes")} 
                     />
                  </div>
               </div>
               </div>

               <div className="buttons">
               <button type="submit" className="save">
                  <FaCheckCircle /> Guardar Alterações
               </button>
               <button
                  type="button"
                  className="cancel"
                  onClick={() => navigate("/Obras")}
               >
                  <FaCircleXmark /> Cancelar
               </button>
               </div>
            </form>
         </div>
      </div>
   );
}

export default EditarEncomenda;