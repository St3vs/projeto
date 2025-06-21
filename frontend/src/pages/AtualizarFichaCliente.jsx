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

const EditarCliente = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const token = localStorage.getItem("token");
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [contacto, setContacto] = useState("");
   const [nif, setNif] = useState(""); 
   const [morada, setMorada] = useState("");
   const [cp, setCp] = useState("");
   const [localidade, setLocalidade] = useState("");   

   const [editavel, setEditavel] = useState({
      username: false,
      email: false,
      contacto: false,
      nif: false,
      morada: false,
      cp: false,
      localidade: false,
   });

   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
      const fetchCliente = async () => {
         try {
         const response = await axios.get(`${apiUrl}/clientes/getCliente/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         const cliente = response.data;
         setUsername(cliente.username || "");
         setEmail(cliente.email || "");
         setContacto(cliente.contacto || "");
         setNif(cliente.nif || "");
         setMorada(cliente.morada || "");
         setCp(cliente.cp || "");
         setLocalidade(cliente.localidade || "");
         } catch (error) {
         console.error("Erro ao pesquisar Cliente:", error);
         alert("Não foi possível carregar os dados do cliente.");
         }
      };

      fetchCliente();
   }, [id, token]);

   const toggleEdit = (campo) => {
      setEditavel((prev) => ({ ...prev, [campo]: !prev[campo] }));
   };

   const handleAtualizarCliente = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.put(
         `${apiUrl}/clientes/atualizarCliente/${id}`,
         { username, email, contacto, nif, morada, cp, localidade },
         { headers: { Authorization: `Bearer ${token}` } }
         );
         if (response.status === 200) {
         alert("Cliente atualizado com sucesso!");
         navigate("/Clientes");
         }
      } catch (error) {
         console.error("Erro ao atualizar cliente:", error);
         alert("Erro ao tentar atualizar o cliente.");
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

         <div className="content-formulario">
         <div className="header-section">
            <div className="historico">
               <button className="voltarHome" onClick={() => navigate("/homepage")}>
               <FaHouse />
               </button>
               <MdOutlineKeyboardArrowRight />
               <button
               className="voltarHome"
               onClick={() => navigate("/Clientes")}
               >
               CLIENTES
               </button>
               <MdOutlineKeyboardArrowRight />
               <h2>Editar Cliente {id}</h2>
            </div>
         </div>

         <form className="inserir-novo" onSubmit={handleAtualizarCliente}>
            <h1>Editar Cliente</h1>

            <div className="form-group">
               <label htmlFor="username">Nome do Cliente:</label>
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

            <div className="form-row">
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
            </div>

            <div className="form-group">
               <label htmlFor="morada">Morada:</label>
               <div className="input-wrapper">
               <input
                  id="morada"
                  type="text"
                  value={morada}
                  onChange={(e) => setMorada(e.target.value)}
                  className={editavel.morada ? "input-editing" : ""}
                  disabled={!editavel.morada}
               />
               <FaPencilAlt
                  className={`edit-icon ${editavel.morada ? "edit-icon-active" : ""}`}
                  onClick={() => toggleEdit("morada")}
               />
               </div>
            </div>

            <div className="form-row">
               <div className="form-group">
                  <label htmlFor="cp">CP:</label>
                  <div className="input-wrapper">
                  <input
                     id="cp"
                     type="text"
                     value={cp}
                     onChange={(e) => setCp(e.target.value)}
                     className={editavel.cp ? "input-editing" : ""}
                     disabled={!editavel.cp}
                  />
                  <FaPencilAlt
                     className={`edit-icon ${editavel.cp ? "edit-icon-active" : ""}`}
                     onClick={() => toggleEdit("cp")}
                  />
                  </div>
               </div>

               <div className="form-group">
                  <label htmlFor="localidade">Localidade:</label>
                  <div className="input-wrapper">
                  <input
                     id="localidade"
                     type="text"
                     value={localidade}
                     onChange={(e) => setLocalidade(e.target.value)}
                     className={editavel.localidade ? "input-editing" : ""}
                     disabled={!editavel.localidade}
                  />
                  <FaPencilAlt
                     className={`edit-icon ${editavel.localidade ? "edit-icon-active" : ""}`}
                     onClick={() => toggleEdit("localidade")}
                  />
                  </div>
               </div>
            </div>
            <div className="buttons">
               <button type="submit" className="save">
               <FaCheckCircle /> GUARDAR ALTERAÇÕES
               </button>
               <button
                  type="button"
                  className="cancel"
                  onClick={() => navigate("/Clientes")}
                  >
                  <FaCircleXmark /> CANCELAR
               </button>
            </div>
         </form>
         </div>
      </div>
   );
};

export default EditarCliente;
