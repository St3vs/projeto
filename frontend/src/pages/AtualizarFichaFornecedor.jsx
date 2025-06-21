import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { FaCheckCircle, FaPencilAlt } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaHouse } from "react-icons/fa6";
import { apiUrl } from "../api";

const EditarFornecedor = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [contacto, setContacto] = useState("");
   const [nif, setNif] = useState(""); 

   const [editavel, setEditavel] = useState({
      username: false,
      email: false,
      contacto: false,
      nif: false,
   });

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
      const fetchFornecedor = async () => {
         try {
         const response = await axios.get(`${apiUrl}/fornecedores/getFornecedor/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         const fornecedor = response.data;
         setUsername(fornecedor.username || "");
         setEmail(fornecedor.email || "");
         setContacto(fornecedor.contacto || "");
         setNif(fornecedor.nif || "");
         } catch (error) {
         console.error("Erro ao pesquisar fornecedor:", error);
         alert("Não foi possível carregar os dados do fornecedor.");
         }
      };

      fetchFornecedor();
   }, [id, token]);

   const toggleEdit = (campo) => {
      setEditavel((prev) => ({ ...prev, [campo]: !prev[campo] }));
   };

   const handleAtualizarFornecedor = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.put(
         `${apiUrl}/fornecedores/atualizarFornecedor/${id}`,
         { username, email, contacto, nif },
         { headers: { Authorization: `Bearer ${token}` } }
         );
         if (response.status === 200) {
         alert("Fornecedor atualizado com sucesso!");
         navigate("/Fornecedores");
         }
      } catch (error) {
         console.error("Erro ao atualizar fornecedor:", error);
         alert("Erro ao tentar atualizar o fornecedor.");
      }
   };

   const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
               <button
               className="voltarHome"
               onClick={() => navigate("/Fornecedores")}
               >
               FORNECEDORES
               </button>
               <MdOutlineKeyboardArrowRight />
               <h2>Editar Fornecedor {id}</h2>
            </div>
         </div>

         <form className="inserir-novo" onSubmit={handleAtualizarFornecedor}>
            <h1>Editar Fornecedor</h1>

            <div className="form-group">
               <label htmlFor="username">Nome do Fornecedor:</label>
               <div className="input-wrapper">
               <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!editavel.username}
                  className={editavel.username ? "input-editing" : ""}
                  required
               />
               <FaPencilAlt
                  className={`edit-icon ${editavel.username ? "edit-icon-active" : ""}`}
                  onClick={() => toggleEdit("username")}
               />
               </div>
            </div>

            <div className="form-group">
               <label htmlFor="email">Email:</label>
               <div className="input-wrapper">
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editavel.email}
                  className={editavel.email ? "input-editing" : ""}
                  required
               />
               <FaPencilAlt
                  className={`edit-icon ${editavel.email ? "edit-icon-active" : ""}`}
                  onClick={() => toggleEdit("email")}
               />
               </div>
            </div>

            <div className="form-group">
               <label htmlFor="contacto">Contacto:</label>
               <div className="input-wrapper">
               <input
                  id="contacto"
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  disabled={!editavel.contacto}
                  className={editavel.contacto ? "input-editing" : ""}
                  required
               />
               <FaPencilAlt
                  className={`edit-icon ${editavel.contacto ? "edit-icon-active" : ""}`}
                  onClick={() => toggleEdit("contacto")}
               />
               </div>
            </div>

            <div className="form-group">
               <label htmlFor="nif">NIF:</label>
               <div className="input-wrapper">
               <input
                  id="nif"
                  type="text"
                  value={nif}
                  onChange={(e) => setNif(e.target.value)}
                  className={editavel.nif ? "input-editing" : ""}
                  disabled={!editavel.nif}
               />
               <FaPencilAlt
                  className={`edit-icon ${editavel.nif ? "edit-icon-active" : ""}`}
                  onClick={() => toggleEdit("nif")}
               />
               </div>
            </div>

            <div className="buttons">
               <button type="submit" className="save">
               <FaCheckCircle /> GUARDAR ALTERAÇÕES
               </button>
               <button
                  type="button"
                  className="cancel"
                  onClick={() => navigate("/Fornecedores")}
                  >
                  <FaCircleXmark /> CANCELAR
               </button>
            </div>
         </form>
         </div>
      </div>
   );
};

export default EditarFornecedor;
