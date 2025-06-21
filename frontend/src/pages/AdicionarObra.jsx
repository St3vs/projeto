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
import { apiUrl } from "../api";

const InserirNovaObra = () => {
   const [projetoId, setProjetoId] = useState(null);
   const [projetoIdProjeto, setProjetoIdProjeto] = useState('');
   const [projetoIdCliente, setProjetoIdCliente] = useState('');
   const [assunto, setAssunto] = useState('');
   const [projetos, setProjetos] = useState([]);
   const [descricao, setDescricao] = useState('');
   const [data, setData] = useState('');
   const [dataUltimaFatura, setDataUltimaFatura] = useState('');
   const [valorProposta, setValorProposta] = useState('');
   const [valorFaturado, setValorFaturado] = useState('');
   const [pesquisarProjeto, setPesquisarProjeto] = useState('');
   const [filteredProjetos, setFilteredProjetos] = useState([]);
   const [highlightIndex, setHighlightIndex] = useState(-1);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [clienteNome, setClienteNome] = useState('');
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/');
         return;
      }

      const fetchProjetos = async () => {
         try {
            //const response = await axios.get("http://localhost:4000/clientes/listarClientes", {
            const response = await axios.get(`${apiUrl}/projetos/listarProjetos`, {
               headers: { Authorization: `Bearer ${token}` }
            });
            setProjetos(response.data);
         } catch (error) {
            console.error("Erro ao pesquisar projetos:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
               navigate('/');
            }
         }
      };

      fetchProjetos();
   }, [navigate]);

   const handleSearch = (event) => {
   const query = event.target.value.toLowerCase();
   setPesquisarProjeto(query);

   if (query) {
      const filtered = projetos.filter(
         (p) =>
            String(p.id).toLowerCase().includes(query) ||
            String(p.clienteId).toLowerCase().includes(query) ||
            (p.assunto && p.assunto.toLowerCase().includes(query))
         );
      setFilteredProjetos(filtered);
      setHighlightIndex(-1);
   } else {
      setFilteredProjetos([]);
   }
   };

   const selecionarProjeto = (projeto) => {
      setProjetoId(projeto.id);
      setProjetoIdProjeto(projeto.clienteId);
      setProjetoIdCliente(projeto.clienteId);
      setClienteNome(projeto.clienteNome);
      setAssunto(projeto.assunto);
      setPesquisarProjeto('');
      setFilteredProjetos([]);
   };

   const handleInserirNovaObra = async (e) => {
      e.preventDefault();

      if (!projetoId) {
         alert("Por favor, selecione um projeto válido.");
         return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/');
         return;
      }

      try {
         //const response = await axios.post('http://localhost:4000/obras/inserirNovaObra', {
         const response = await axios.post(`${apiUrl}/obras/inserirNovaObra`, {
            projetoId,
            assunto,
            descricao,
            data,
            valorProposta,
            valorFaturado,
            dataUltimaFatura,
         }, {
            headers: { Authorization: `Bearer ${token}` }
         });

         if (response.status === 201) {
            alert('Obra inserida com sucesso!');
            navigate('/Obras');
         }
      } catch (error) {
         console.error('Erro:', error);
         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            navigate('/');
         } else {
            alert('Erro ao tentar inserir obra.');
         }
      }
   };

   const handleKeyDown = (e) => {
      if (filteredProjetos.length === 0) return;

      if (e.key === "ArrowDown") {
         setHighlightIndex((prev) => Math.min(prev + 1, filteredProjetos.length - 1));
      } else if (e.key === "ArrowUp") {
         setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && highlightIndex >= 0) {
         selecionarProjeto(filteredProjetos[highlightIndex]);
      }
   };

   const handleChangeData = (e) => setData(e.target.value);
   const handleChangeDataUltimaFatura = (e) => setDataUltimaFatura(e.target.value);

   const handleValorChange = (e, setValue) => {
      let value = e.target.value;
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) {
         value = parts[0] + "." + parts.slice(1).join("");
      }
      if (parts.length === 2 && parts[1].length > 2) {
         value = parts[0] + "." + parts[1].slice(0, 2);
      }
      setValue(value);
   };

   const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

   return (
      <div className="inserir">
         <Header toggleSidebar={toggleSidebar} />
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
                  <h4>Dados do projeto:</h4>
                  <div className="form-group">
                     <div className="search-container">
                        <input
                           type="text"
                           placeholder="Pesquisar por ID do cliente ou Assunto do Projeto"
                           value={pesquisarProjeto}
                           onChange={handleSearch}
                           onKeyDown={handleKeyDown}
                           onBlur={() => setTimeout(() => setFilteredProjetos([]), 100)}
                        />
                        {filteredProjetos.length > 0 && (
                           <ul className="dropdown">
                              {filteredProjetos.map((f, index) => (
                                 <li
                                    key={f.id}
                                    className={index === highlightIndex ? "highlight" : ""}
                                    onClick={() => selecionarProjeto(f)}
                                    onMouseEnter={() => setHighlightIndex(index)}
                                 >
                                    {`Id do projeto: ${f.id} - Id do cliente: ${f.clienteId} - Assunto do projeto: "${f.assunto}"`}
                                 </li>
                              ))}
                           </ul>
                        )}
                     </div>
                  </div>
                  <div className="form-row">
                     <div className="form-group">
                        <label htmlFor="projetoId">ID do Projeto:</label>
                        <input
                           type="text"
                           id="projetoId"
                           name="projetoId"
                           value={projetoIdProjeto}
                           disabled
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="clienteId">ID do Cliente:</label>
                        <input
                           type="text"
                           id="clienteId"
                           name="clienteId"
                           value={projetoIdCliente}
                           disabled
                        />
                     </div>
                     <div className="form-group">
                        <label htmlFor="assunto">Assunto:</label>
                        <input
                           type="text"
                           id="assunto"
                           name="assunto"
                           value={assunto}
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
                           value={data}
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
                        <label htmlFor="valorFaturado">Valor Faturado:</label>
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
                           value={dataUltimaFatura}
                           onChange={handleChangeDataUltimaFatura}
                        />
                     </div>
                  </div>
                  <div className="buttons">
                     <button type="submit" className="save"><FaCheckCircle /> GUARDAR</button>
                     <button type="button" className="cancel" onClick={() => navigate('/Obras')}><FaCircleXmark /> CANCELAR</button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default InserirNovaObra;