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

const inserirNovaEncomenda = () => {
   const [fornecedor, setFornecedor] = useState('');
   const [contacto, setContacto] = useState('');
   const [fornecedores, setFornecedores] = useState([]);
   const [descricaoMaterial, setDescricaoMaterial] = useState('');
   const [observacoes, setObservacoes] = useState('');
   const [data, setData] = useState('');
   const [previsaoEntrega, setPrevisaoEntrega] = useState('');
   const [valor, setValor] = useState('');
   const [pesquisarFornecedor, setPesquisarFornecedor] = useState('');
   const [filteredFornecedores, setFilteredFornecedores] = useState([]);
   const navigate = useNavigate();
   const [highlightIndex, setHighlightIndex] = useState(-1);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   // Pega o token do localStorage (ou de onde você armazenar)
   const token = localStorage.getItem('token');

   useEffect(() => {
      const fetchFornecedores = async () => {
         try {
            const response = await axios.get("http://localhost:4000/fornecedores/listarFornecedores", {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });
            setFornecedores(response.data);
         } catch (error) {
            console.error("Erro ao pesquisar fornecedores:", error);
         }
      };

      fetchFornecedores();
   }, [token]);

   const handleSearch = (event) => {
      const query = event.target.value.toLowerCase();
      setPesquisarFornecedor(query);

      if (query) {
            const filtered = fornecedores.filter(
               (f) =>
                  f.username.toLowerCase().includes(query) ||
                  f.contacto.includes(query)
            );
            setFilteredFornecedores(filtered);
            setHighlightIndex(-1);
      } else {
            setFilteredFornecedores([]);
      }
   };

   const selecionarFornecedor = (fornecedor) => {
      setFornecedor(fornecedor.username);
      setContacto(fornecedor.contacto);
      setPesquisarFornecedor("");
      setFilteredFornecedores([]);
   };

   const handleInserirNovaEncomenda = async (e) => {
      e.preventDefault();

      if (contacto.replace(/\D/g, '').length !== 9) {
         alert("O contacto deve conter exatamente 9 dígitos.");
         return;
      }

      try {
         const response = await axios.post('http://localhost:4000/encomendas/inserirNovaEncomenda', {
            fornecedor,
            contacto,
            descricaoMaterial,
            data,
            previsaoEntrega,
            valor,
            observacoes
         }, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });

         if (response.status === 201) {
            alert('Encomenda adicionada com sucesso!');
         }
      } catch (error) {
         console.error('Erro:', error);
         alert('Erro ao tentar adicionar a proposta.');
      }
   };

   const handleKeyDown = (e) => {
      if (setFilteredFornecedores.length === 0) return;

      if (e.key === "ArrowDown") {
         setHighlightIndex((prev) => Math.min(prev + 1, filteredFornecedores.length - 1));
      } else if (e.key === "ArrowUp") {
         setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && highlightIndex >= 0) {
         selecionarFornecedor(filteredFornecedores[highlightIndex]);
      }
   };

   const handleChangeData = (e) => {
      const dataSelecionada = e.target.value; 
      setData(dataSelecionada);
   };

   const handleChangePrevisaoEntrega = (e) => {
      const dataEntregaSelecionada = e.target.value; 
      setPrevisaoEntrega(dataEntregaSelecionada);
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
                     <button className='voltarHome' onClick={() => navigate('/Encomendas')}>Encomendas</button>
                     <MdOutlineKeyboardArrowRight />
                     <h2>Adicionar Nova Encomenda</h2>
                  </div>
               </div>
               <div>
                  <form className='inserir-novo' onSubmit={handleInserirNovaEncomenda}>
                     <h1>Adicionar Nova Encomenda</h1>
                     <h4>Dados do fornecedor:</h4>
                     <div className="form-group">
                        <div className="search-container">
                           <input
                              type="text"
                              placeholder="Pesquisar por Nome ou Contacto"
                              value={pesquisarFornecedor}
                              onChange={handleSearch}
                              onKeyDown={handleKeyDown}
                              onBlur={() => setTimeout(() => setFilteredFornecedores([]), 100)} 
                           />
                           {filteredFornecedores.length > 0 && (
                              <ul className="dropdown">
                                 {filteredFornecedores.map((f, index) => (
                                    <li
                                       key={f.id}
                                       className={index === highlightIndex ? "highlight" : ""}
                                       onClick={() => selecionarFornecedor(f)}
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
                              <label htmlFor="fornecedor">Nome do Fornecedor:</label>
                              <input
                                 type="text"
                                 id="fornecedor"
                                 name="fornecedor"
                                 value={fornecedor}
                                 onChange={(e) => setFornecedor(e.target.value)}
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
                     <h4>Detalhes da encomenda:</h4>
                     <div className="form-group">
                        <label htmlFor="descricaoMaterial">Descrição do Material:</label>
                        <textarea 
                           id="descricaoMaterial" 
                           name="descricaoMaterial" 
                           placeholder="Insira a descrição do material"
                           value={descricaoMaterial} 
                           onChange={(e) => setDescricaoMaterial(e.target.value)} 
                        />
                     </div>
                     <div className="form-row">
                        <div className="form-group">
                           <label htmlFor="data">Data:</label>
                           <input 
                              type="date" 
                              id="data" 
                              name="data"
                              value={data ? data.split("T")[0] : ""}  
                              onChange={handleChangeData} 
                           />
                        </div>
                           <div className="form-group">
                           <label htmlFor="previsaoEntrega">Previsão de Entrega:</label>
                           <input 
                              type="date" 
                              id="previsaoEntrega" 
                              name="previsaoEntrega"
                              value={previsaoEntrega ? previsaoEntrega.split("T")[0] : ""}  
                              onChange={handleChangePrevisaoEntrega} 
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="valor">Valor:</label>
                           <input
                              type="text"
                              id="valor"
                              name="valor"
                              placeholder="Insira o valor"
                              value={valor ? `€ ${valor}` : ""} // Exibe o valor formatado com o símbolo de euro
                              onChange={(e) => {
                                 let value = e.target.value;

                                 // Remove o símbolo de euro e espaços
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

                                 setValor(value); // Atualiza o estado com o valor numérico
                              }}
                           />
                        </div>
                        <div className="form-group">
                           <label htmlFor="observacoes">Observações:</label>
                           <textarea 
                              id="observacoes" 
                              name="observacoes" 
                              placeholder="Observações adicionais"
                              value={observacoes} 
                              onChange={(e) => setObservacoes(e.target.value)} 
                           />
                        </div>
                     </div>
                     <div className="buttons">
                        <button type="submit" className="save" onClick={() => navigate('/Encomendas')}><FaCheckCircle /> GUARDAR</button>
                        <button type="button" className="cancel" onClick={() => navigate('/Encomendas')}><FaCircleXmark /> CANCELAR</button>
                     </div>
                  </form>
               </div>
         </div>
      </div>
   );
};

export default inserirNovaEncomenda;
