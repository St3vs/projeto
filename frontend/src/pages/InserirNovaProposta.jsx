import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Formularios.css';
import Header from "../components/Header";
import '../styles/Header.css';
import { FaCircleXmark, FaHouse } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/Sidebar.css";
import Sidebar from "../components/Sidebar";
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MdAccessTimeFilled } from "react-icons/md";

const InserirNovaProposta = () => {
    const [cliente, setCliente] = useState('');
    const [contacto, setContacto] = useState('');
    const [assunto, setAssunto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [valor, setValor] = useState('');
    const [estado, setEstado] = useState('');
    const [pesquisarCliente, setPesquisarCliente] = useState('');
    const [clientes, setClientes] = useState([]);
    const [clienteId, setClienteId] = useState(null); 
    const [filteredClientes, setFilteredClientes] = useState([]);
    const navigate = useNavigate();
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchClientes = async () => {
            try {
               const token = localStorage.getItem('token');
               //const response = await axios.get("http://localhost:4000/clientes/listarClientes", {
               const response = await axios.get(`${apiUrl}/clientes/listarClientes`, {
                  headers: {
                     Authorization: `Bearer ${token}`
                  }
               });
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
        setClienteId(cliente.id); // Guarda o ID do cliente selecionado
        setPesquisarCliente("");
        setFilteredClientes([]);
    };

    const handleInserirNovaProposta = async (e) => {
        e.preventDefault();

        if (!clienteId) {
            alert("Por favor, pesquise e selecione um cliente da lista.");
            return;
        }

        if (contacto.replace(/\D/g, '').length !== 9) {
            alert("O contacto deve conter exatamente 9 dígitos.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                //'http://localhost:4000/propostas/inserirNovaProposta',
                `${apiUrl}/propostas/inserirNovaProposta`,
                {
                    clienteId,
                    assunto,
                    descricao,
                    data,
                    valor,
                    estado
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 201) {
                alert('Proposta inserida com sucesso!');
                navigate('/Propostas');
            }
        } catch (error) {
            console.error('Erro ao tentar inserir a proposta:', error.response ? error.response.data : error.message);
            alert('Erro ao tentar inserir a proposta. Verifique a consola para mais detalhes.');
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

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

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
                        <button className='voltarHome' onClick={() => navigate('/Propostas')}>PROPOSTAS</button>
                        <MdOutlineKeyboardArrowRight />
                        <h2>Inserir Nova Proposta</h2>
                    </div>
                </div>
                <div>
                    <form className='inserir-novo' onSubmit={handleInserirNovaProposta}>
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
                                    onBlur={() => setTimeout(() => setFilteredClientes([]), 150)} 
                                />
                                {filteredClientes.length > 0 && (
                                    <ul className="dropdown">
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
                                    readOnly // Alterado para readOnly para maior clareza
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
                                    readOnly // Alterado para readOnly para maior clareza
                                    disabled
                                />
                            </div>
                        </div>
                        <h4>Detalhes da proposta:</h4>
                        <div className="form-group">
                            <div className="assunto">
                                <label htmlFor="assunto">Assunto:</label>
                                <input type="text" id="assunto" name="assunto" placeholder="Insira o assunto"
                                    value={assunto} onChange={(e) => setAssunto(e.target.value)} required />
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
                                required
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
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="valor">Valor:</label>
                                <input
                                    type="text"
                                    id="valor"
                                    name="valor"
                                    placeholder="€ 0.00"
                                    value={valor ? `€ ${valor}` : ""} 
                                    onChange={(e) => {
                                        let value = e.target.value;
                                        value = value.replace(/[^0-9.]/g, ""); 

                                        const parts = value.split(".");
                                        if (parts.length > 2) {
                                            value = parts[0] + "." + parts.slice(1).join("");
                                        }
                                        if (parts.length === 2 && parts[1].length > 2) {
                                            value = parts[0] + "." + parts[1].slice(0, 2);
                                        }
                                        setValor(value);
                                    }}
                                    required
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
                                        required
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
                            {/* O botão "Guardar" deve ser do tipo "submit" para o formulário funcionar */}
                            <button type="submit" className="save"><FaCheckCircle /> GUARDAR</button>
                            <button type="button" className="cancel" onClick={() => navigate('/Propostas')}><FaCircleXmark /> CANCELAR</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default InserirNovaProposta;