import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import '../styles/PaginasSidebar.css';
import "../styles/Sidebar.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from 'axios';

function Obras() {
   
   const [obras, setObras] = useState([]);
   const [pesquisarObra, setPesquisarObra] = useState('');
   const [selecionarObras, setSelecionarObras] = useState([]);
   const [selecionarTodas, setSelecionarTodas] = useState(false);
   const navigate = useNavigate();
   
   
   useEffect(() => {
      const fetchObras = async () => {
         try {
            const response = await axios.get("http://localhost:4000/obras/listarObras");
            setObras(response.data);
         } catch (error) {
            console.error("Erro ao encontrar obras:", error);
         }
      };

      fetchObras();
   }, []);
   

   const handlePesquisar = (event) => {
      setPesquisarObra(event.target.value);
   };

   const handleSelectObra = (obraId) => {
      if (selecionarObras.includes(obraId)) {
         setSelecionarObras(selecionarObra.filter(id => id !== obraId));
      } else {
         setSelecionarObras([selecionarObras, obraId]);
      }
   };

   const handleSelecionarTodas = () => {
      if (selecionarTodas) {
         setSelecionarObras([]);
      } else {
         const allObrasIds = obras.map(obra => obra.id);
         setSelecionarObras(allObrasIds);
      }
      setSelecionarTodas(!selecionarTodas);
   };

   
   const handleDeleteSelected = async () => {
      if (selecionarObras.length === 0) {
          alert("Nenhuma obra selecionada!");
          return;
      }
  
      try {
          const response = await axios.delete("http://localhost:4000/obras/eliminarObras", {
              data: { ids: selecionarObras }
          });
  
          console.log("Resposta do servidor:", response.data);
  
          // Recarregar as propostas do backend para refletir os novos IDs
          const updatedObras = await axios.get("http://localhost:4000/obras/listarObras");
          setObras(updatedObras.data);
  
          // Limpar as seleções
          setSelecionarObras([]);
          setSelecionarTodas(false);
  
         } catch (error) {
          console.error("Erro ao eliminar obra(s):", error.response ? error.response.data : error);
          alert("Erro ao eliminar obra(s)");
      }
   };

   const pesquisarCliente = obras.filter(obra =>
      (obra.cliente && obra.cliente.toLowerCase().includes(pesquisarObra.toLowerCase())) ||
      (obra.contacto && obra.contacto.includes(pesquisarObra))
   );

   const inserirNovaObra = () => {
      navigate('/Obras/InserirNovaObra');
   };

   const voltarHome = () => {
      navigate('/homepage');
   };

   return (
      <div className="paginas-sidebar">
         {<Sidebar />}
         <div className='paginas-sidebar-content'>
            <div className='header-section'>
               <div className='historico'>
                  <button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
                  <MdOutlineKeyboardArrowRight />
                  <h2>OBRAS</h2>
               </div>
            </div>
            <div className='criarFichaButton'>
               <button className='criarFicha' onClick={inserirNovaObra}>Inserir Nova Obra</button>
            </div>
            <div className="search-bar">
               <input
                  type="text"
                  placeholder="Pesquisar por Nome ou Contacto do cliente"
                  value={pesquisarObra}
                  onChange={handlePesquisar}
               />
               <button className="delete-button" onClick={handleDeleteSelected}>
                  <RiDeleteBin5Line />
               </button>
            </div>
            <table>
               <thead>
                  <tr>
                     <th>
                        <input
                           type="checkbox"
                           checked={selecionarTodas}
                           onChange={handleSelecionarTodas}
                        />
                     </th>
                     <th>ID</th>
                     <th>Cliente</th>
                     <th>Descrição da Obra</th>
                     <th>Data</th>
                     <th>Valor da Proposta</th>
                     <th>Valor faturado</th>
                     <th>Data da última fatura</th>
                  </tr>
               </thead>
               <tbody>
                  {pesquisarCliente.map(obra => (
                     <tr 
                        key={obra.id} 
                        onClick={() => navigate(`/obras/EditarObra/${obra.id}`)} // Corrigido aqui
                        className="clickable-row"
                     >
                        <td onClick={(e) => e.stopPropagation()}>
                           <input
                              type="checkbox"
                              checked={selecionarObras.includes(obra.id)}
                              onChange={() => handleSelectObra(obra.id)}
                           />
                        </td>
                        <td>{obra.id}</td>
                        <td>{obra.cliente}</td>
                        <td>{obra.descricao}</td>
                        <td>{obra.data ? new Date(obra.data).toLocaleDateString("pt-PT") : "Sem data"}</td>
                        <td>{obra.valorProposta} €</td>
                        <td>{obra.valorFaturado} €</td>
                        <td>{obra.dataUltimaFatura ? new Date(obra.dataUltimaFatura).toLocaleDateString("pt-PT") : "Sem data"}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}

export default Obras;