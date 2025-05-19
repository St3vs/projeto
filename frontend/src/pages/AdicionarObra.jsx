import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Formularios.css';
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/Sidebar.css";
import Sidebar from "../components/Sidebar";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import '../styles/Header.css';

const inserirNovaObra = () => {
   const [cliente, setCliente] = useState('');
   const [contacto, setContacto] = useState('');
   const [clientes, setClientes] = useState([]);
   const [descricao, setDescricao] = useState('');
   const [data, setData] = useState('');
   const [dataUltimaFatura, setDataUltimaFatura] = useState('');
   const [valorProposta, setValorProposta] = useState('');
   const [valorFaturado, setValorFaturado] = useState('');
   const [pesquisarCliente, setPesquisarCliente] = useState('');
   const [filteredClientes, setFilteredClientes] = useState([]);
   const navigate = useNavigate();
   const [highlightIndex, setHighlightIndex] = useState(-1);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   useEffect(() => {
      const fetchClientes = async () => {
         try {
               const response = await axios.get("http://localhost:4000/clientes/listarClientes");
               setClientes(response.data);
         } catch (error) {
               console.error("Erro ao buscar clientes:", error);
         }
      };

      fetchClientes();
   }, []);

   const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      setPesquisarCliente(query);

      if (query) {
            const filtered = clientes.filter(
               (c) =>
                  c.username.toLowerCase().includes(query) ||
                  c.contacto.includes(query)
            );
            setFilteredClientes(filtered);
            setHighlightIndex(-1);
      } else {
            setFilteredClientes([]);
      }
   };

   const selecionarCliente = (cliente) => {
      setCliente(cliente.username);
      setContacto(cliente.contacto);
      setPesquisarCliente("");
      setFilteredClientes([]);
   };

   const handleInserirNovaObra = async (e) => {
      e.preventDefault();

      if (contacto.replace(/\D/g, '').length !== 9) {
         alert("O contacto deve conter exatamente 9 dígitos.");
         return;
      }

      try {
         const response = await axios.post('http://localhost:4000/obras/inserirNovaObra', {
            cliente,
            contacto,
            descricao,
            data,
            valorProposta,
            valorFaturado,
            dataUltimaFatura,
         });

         if (response.status === 201) {
               alert('Obra inserida com sucesso!');
         }
      } catch (error) {
         console.error('Erro:', error);
         alert('Erro ao tentar inserir obra.');
      }
   };

   const handleKeyDown = (e) => {
      if (filteredClientes.length === 0) return;

      if (e.key === "ArrowDown") {
         setHighlightIndex((prev) => Math.min(prev + 1, filteredClientes.length - 1));
      } else if (e.key === "ArrowUp") {
         setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && highlightIndex >= 0) {
         selecionarCliente(filteredClientes[highlightIndex]);
      }
   };

   const handleChangeData = (e) => {
      const dataSelecionada = e.target.value; 
      setData(dataSelecionada);
   };

   const handleChangeDataUltimaFatura = (e) => {
      const dataUltimaFaturaSelecionada = e.target.value; 
      setDataUltimaFatura(dataUltimaFaturaSelecionada);
   };

      const handleValorChange = (e, setValue) => {
      let value = e.target.value;

      // Remove todos os caracteres não numéricos, exceto ponto
      value = value.replace(/[^0-9.]/g, "");

      // Permite apenas um ponto decimal
      const parts = value.split(".");
      if (parts.length > 2) {
         value = parts[0] + "." + parts.slice(1).join("");
      }

      // Limita a duas casas decimais
      if (parts.length === 2 && parts[1].length > 2) {
         value = parts[0] + "." + parts[1].slice(0, 2);
      }

      setValue(value); // Atualiza o valor numérico
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
                     <button className='voltarHome' onClick={() => navigate('/homepage')}><FaHouse /></button>
                     <MdOutlineKeyboardArrowRight />
                     <button className='voltarHome' onClick={() => navigate('/Obras')}>Obras</button>
                     <MdOutlineKeyboardArrowRight />
                     <h2>Adicionar Nova Obra</h2>
                  </div>
               </div>
               <div>
                  <form className='inserir-novo' onSubmit={handleInserirNovaObra}>
                     <h1>Adicionar Nova Obra</h1>
                     <h4>Dados do cliente:</h4>
                     <div className="form-group">
                        <div className="search-container">
                           <input
                              type="text"
                              placeholder="Pesquisar por Nome ou Contacto"
                              value={pesquisarCliente}
                              onChange={handleSearch}
                              onKeyDown={handleKeyDown}
                              onBlur={() => setTimeout(() => setFilteredClientes([]), 100)} 
                           />
                           {filteredClientes.length > 0 && (
                              <ul className="dropdown">
                                 {filteredClientes.map((f, index) => (
                                    <li
                                       key={f.id}
                                       className={index === highlightIndex ? "highlight" : ""}
                                       onClick={() => selecionarCliente(f)}
                                       onMouseEnter={() => setHighlightIndex(index)}
                                    >
                                       {f.username} - {f.contacto}
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </div>
                     </div>
                     <div className="form-row">
                           <div className="form-group">
                              <label htmlFor="cliente">Nome do Cliente:</label>
                              <input
                                 type="text"
                                 id="cliente"
                                 name="cliente"
                                 value={cliente}
                                 onChange={(e) => setCliente(e.target.value)}
                                 disabled
                              />
                           </div>
                           <div className="form-group">
                              <label htmlFor="contacto">Contacto:</label>
                              <input
                                 type="text"
                                 id="contacto"
                                 name="contacto"
                                 value={contacto}
                                 onChange={(e) => setContacto(e.target.value)}
                                 disabled
                              />
                           </div>
                     </div>
                     <h4>Detalhes da obra:</h4>
                     <div className="form-group">
                        <label htmlFor="descricao">Descrição:</label>
                        <textarea 
                           id="descricao" 
                           name="descricao" 
                           placeholder="Insira a descrição da obra"
                           value={descricao} 
                           onChange={(e) => setDescricao(e.target.value)} 
                        />
                     </div>
                     <div className="form-row">
                        <div className="form-group">
                           <label htmlFor="data">Data da Obra:</label>
                           <input 
                              type="date" 
                              id="data" 
                              name="data"
                              value={data ? data.split("T")[0] : ""}  
                              onChange={handleChangeData} 
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="valorProposta">Valor da Proposta:</label>
                           <input
                              type="text"
                              id="valorProposta"
                              name="valorProposta"
                              placeholder="Insira o valor da proposta"
                              value={valorProposta ? `€ ${valorProposta}` : ""} 
                              onChange={(e) => handleValorChange(e, setValorProposta)}
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="valorFaturado">Valor da Proposta:</label>
                           <input
                              type="text"
                              id="valorFaturado"
                              name="valorFaturado"
                              placeholder="Insira o valor faturado"
                              value={valorFaturado ? `€ ${valorFaturado}` : ""} 
                              onChange={(e) => handleValorChange(e, setValorFaturado)}
                           />                        
                        </div>
                        <div className="form-group">
                           <label htmlFor="dataUltimaFatura">Data da última faturação:</label>
                           <input 
                              type="date" 
                              id="dataUltimaFatura" 
                              name="dataUltimaFatura"
                              value={dataUltimaFatura ? dataUltimaFatura.split("T")[0] : ""}  
                              onChange={handleChangeDataUltimaFatura} 
                           />
                        </div>
                     </div>
                     <div className="buttons">
                        <button type="submit" className="save" onClick={() => navigate('/Obras')}><FaCheckCircle /> GUARDAR</button>
                        <button type="button" className="cancel" onClick={() => navigate('/Obras')}><FaCircleXmark /> CANCELAR</button>
                     </div>
                  </form>
               </div>
         </div>
      </div>
   );
};

export default inserirNovaObra;
