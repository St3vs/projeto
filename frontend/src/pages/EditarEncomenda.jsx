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
      cliente: "",
      descricao: "",
      descricaoMaterial: "",
      data: "",
      previsaoEntrega: "",
      valor: "",
      observacoes: "",
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

         // Ajustar datas para o formato yyyy-mm-dd (input date)
         const dataFormatada = dados.data ? dados.data.split("T")[0] : "";
         const previsaoFormatada = dados.previsaoEntrega
            ? dados.previsaoEntrega.split("T")[0]
            : "";

         // Extrair campos aninhados do fornecedor, obra e cliente
         setEncomenda({
            fornecedor: dados.fornecedor?.username || "",
            contacto: dados.fornecedor?.contacto || "",
            cliente: dados.obra?.cliente?.username || "",
            descricao: dados.obra?.descricao || "",
            descricaoMaterial: dados.descricaoMaterial || "",
            data: dataFormatada,
            previsaoEntrega: previsaoFormatada,
            valor: dados.valor || "",
            observacoes: dados.observacoes || "",
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

               <div className="form-row">
                  <h4>Dados do Fornecedor associado:</h4>
                  <h4>Dados da Obra associada:</h4>
               </div>

               <div className="form-row">
               <div className="form-group">
                  <label>Fornecedor:</label>
                  <input type="text" name="fornecedor" value={encomenda.fornecedor} disabled />
               </div>

               <div className="form-group">
                  <label>Contacto:</label>
                  <input type="text" name="contacto" value={encomenda.contacto} disabled />
               </div>

               <div className="form-group">
                  <label>Cliente:</label>
                  <input type="text" name="cliente" value={encomenda.cliente} disabled />
               </div>

               <div className="form-group">
                  <label>Descrição:</label>
                  <input type="text" name="descricao" value={encomenda.descricao} disabled />
               </div>
               </div>

               <div className="form-group">
               <label>Descrição do Material:</label>
               <div className="input-container">
                  <textarea
                     name="descricaoMaterial"
                     value={encomenda.descricaoMaterial}
                     onChange={handleChange}
                     disabled={!editavel.descricaoMaterial}
                  />
                  <FaPencilAlt
                     className="edit-icon"
                     onClick={() => toggleEdit("descricaoMaterial")}
                  />
               </div>
               </div>

               <div className="form-row">
               <div className="form-group">
                  <label>Data:</label>
                  <div className="input-container">
                     <input
                     type="date"
                     name="data"
                     value={encomenda.data || ""}
                     onChange={handleChange}
                     disabled={!editavel.data}
                     />
                     <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("data")} />
                  </div>
               </div>

               <div className="form-group">
                  <label>Previsão de entrega:</label>
                  <div className="input-container">
                     <input
                     type="date"
                     name="previsaoEntrega"
                     value={encomenda.previsaoEntrega || ""}
                     onChange={handleChange}
                     disabled={!editavel.previsaoEntrega}
                     />
                     <FaPencilAlt
                     className="edit-icon"
                     onClick={() => toggleEdit("previsaoEntrega")}
                     />
                  </div>
               </div>

               <div className="form-group">
                  <label>Valor (€):</label>
                  <div className="input-container">
                     <input
                     type="number"
                     name="valor"
                     value={encomenda.valor}
                     onChange={handleChange}
                     disabled={!editavel.valor}
                     />
                     <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("valor")} />
                  </div>
               </div>
               </div>

               <div className="form-row">
               <div className="form-group">
                  <label>Observações:</label>
                  <div className="input-container">
                     <input
                     type="text"
                     name="observacoes"
                     value={encomenda.observacoes}
                     onChange={handleChange}
                     disabled={!editavel.observacoes}
                     />
                     <FaPencilAlt className="edit-icon" onClick={() => toggleEdit("observacoes")} />
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