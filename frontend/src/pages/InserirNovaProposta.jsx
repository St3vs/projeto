import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/InserirNovaProposta.css';
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/Sidebar.css";
import Sidebar from "../components/Sidebar";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MdAccessTimeFilled } from "react-icons/md";


const inserirNovaProposta = () => {
   const [cliente, setCliente] = useState('');
   const [contacto, setContacto] = useState('');
   const [assunto, setAssunto] = useState('');
   const [descricao, setDescricao] = useState('');
   const [data, setData] = useState('');
   const [valor, setValor] = useState('');
   const [estado, setEstado] = useState('');
   const [pesquisarCliente, setPesquisarCliente] = useState('');
   const [clientes, setClientes] = useState([]);
   const [filteredClientes, setFilteredClientes] = useState([]);
   const navigate = useNavigate();
   const [highlightIndex, setHighlightIndex] = useState(-1);

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

   const handleInserirNovaProposta = async (e) => {
      e.preventDefault();

      if (contacto.replace(/\D/g, '').length !== 9) {
         alert("O contacto deve conter exatamente 9 dígitos.");
         return;
      }

      try {
         const response = await axios.post('http://localhost:4000/propostas/inserirNovaProposta', {
            cliente,
            contacto,
            assunto,
            descricao,
            data,
            valor,
            estado
         });

         if (response.status === 201) {
               alert('Proposta inserida com sucesso!');
         }
      } catch (error) {
         console.error('Erro:', error);
         alert('Erro ao tentar inserir a proposta.');
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

   const estados = [
      { label: "Aceite ", value: "Aceite", icon: <FaCheckCircle style={{ color: "green" }} /> },
      { label: "Pendente", value: "Pendente", icon: <MdAccessTimeFilled style={{ color: "yellow" }} /> },
      { label: "Recusada", value: "Recusada", icon: <FaCircleXmark style={{ color: "red" }} /> },
   ];

   const handleChangeData = (e) => {
      const dataSelecionada = e.target.value; 
      setData(dataSelecionada);
   };

   return (
      <div className="inserir">
         <Sidebar />
         <div className='inserir-nova-proposta-content'>
               <div className='header-section'>
                  <div className='historicoCriarFicha'>
                     <button className='voltarHome' onClick={() => navigate('/homepage')}><FaHouse /></button>
                     <MdOutlineKeyboardArrowRight />
                     <button className='voltarHome' onClick={() => navigate('/Propostas')}>PROPOSTAS</button>
                     <MdOutlineKeyboardArrowRight />
                     <h2>Inserir Nova Proposta</h2>
                  </div>
               </div>
               <div>
                  <form className='inserir-nova-proposta' onSubmit={handleInserirNovaProposta}>
                     <h1>Inserir Nova Proposta</h1>
                     <h4>Dados do cliente:</h4>
                     <div className="form-group">
                        <div className="search-container">
                           <input
                              type="text"
                              placeholder="Pesquisar por Nome ou Contacto"
                              value={pesquisarCliente}
                              onChange={handleSearch}
                              onKeyDown={handleKeyDown}
                              onBlur={() => setTimeout(() => setFilteredClientes([]), 100)} // Fecha dropdown ao perder foco
                           />
                           {filteredClientes.length > 0 && (
                              <ul className="dropdown-clientes">
                                 {filteredClientes.map((c, index) => (
                                    <li
                                       key={c.id}
                                       className={index === highlightIndex ? "highlight" : ""}
                                       onClick={() => selecionarCliente(c)}
                                       onMouseEnter={() => setHighlightIndex(index)}
                                    >
                                       {c.username} - {c.contacto}
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
                     <h4>Detalhes da proposta:</h4>
                     <div className="form-group">
                        <div className="assunto">
                           <label htmlFor="assunto">Assunto:</label>
                           <input type="text" id="assunto" name="assunto" placeholder="Insira o assunto"
                              value={assunto} onChange={(e) => setAssunto(e.target.value)} />
                        </div>
                     </div>
                     <div className="form-group">
                        <label htmlFor="descricao">Descrição:</label>
                        <textarea 
                           id="descricao" 
                           name="descricao" 
                           placeholder="Insira a descrição"
                           value={descricao} 
                           onChange={(e) => setDescricao(e.target.value)} 
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
                           <label htmlFor="estado">Estado:</label>
                           <div className="select-container">
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
                        <button type="submit" className="save" onClick={() => navigate('/Propostas')}><FaCheckCircle /> GUARDAR</button>
                        <button type="button" className="cancel" onClick={() => navigate('/Propostas')}><FaCircleXmark /> CANCELAR</button>
                     </div>
                  </form>
               </div>
         </div>
      </div>
   );
};

export default inserirNovaProposta;
