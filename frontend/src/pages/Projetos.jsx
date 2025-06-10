import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import '../styles/Header.css';
import '../styles/PaginasSidebar.css';
import "../styles/Sidebar.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from 'axios';
import { apiUrl } from "../api";

function Projetos() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [projetos, setProjetos] = useState([]);
    const [pesquisarProjeto, setPesquisarProjeto] = useState('');
    const [selecionarProjetos, setSelecionarProjetos] = useState([]);
    const [selecionarTodos, setSelecionarTodos] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    
    const fetchProjetos = async () => {
        try {
            //const response = await axios.get("http://localhost:4000/projetos/listarProjetos", {
            const response = await axios.get(`${apiUrl}/projetos/listarProjetos`, {
               headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProjetos(response.data);
        } catch (error) {
            console.error("Erro ao buscar projetos:", error);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
        } else {
            fetchProjetos();
        }
    }, [token, navigate]);

    const handlePesquisar = (event) => {
        setPesquisarProjeto(event.target.value);
    };

    const handleSelectProjeto = (projetoId) => {
        if (selecionarProjetos.includes(projetoId)) {
            setSelecionarProjetos(selecionarProjetos.filter(id => id !== projectId));
        } else {
            setSelecionarProjetos([...selecionarProjetos, projectId]);
        }
    };

    const handleSelecionarTodos = () => {
        if (selecionarTodos) {
            setSelecionarProjetos([]);
        } else {
            const allProjetosIds = projetos.map(projeto => projeto.id);
            setSelecionarProjetos(allProjetosIds);
        }
        setSelecionarTodos(!selecionarTodos);
    };

    const handleDeleteSelected = async () => {
        if (selecionarProjetos.length === 0) {
            alert("Nenhum projeto selecionado!");
            return;
        }

        try {
            if (!window.confirm(`Tem a certeza que deseja eliminar ${selecionarProjetos.length} projeto(s)?`)) {
                return;
            }

            //await axios.delete("http://localhost:4000/projetos/eliminarProjetos", {
            await axios.delete(`${apiUrl}/projetos/eliminarProjetos`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: selecionarProjetos }
            });

            fetchProjetos();
            setSelecionarProjetos([]);
            setSelecionarTodos(false);
        } catch (error) {
            console.error("Erro ao eliminar projeto(s):", error.response ? error.response.data : error);
            alert("Erro ao eliminar projeto(s)");
        }
    };

    const projetosFiltrados = projetos.filter(projeto => {
        const termoPesquisa = pesquisarProjeto.toLowerCase();
        const nomeCliente = projeto.cliente ? projeto.cliente.username.toLowerCase() : '';
        const assuntoProjeto = projeto.assunto ? projeto.assunto.toLowerCase() : '';
        
        return nomeCliente.includes(termoPesquisa) || assuntoProjeto.includes(termoPesquisa);
    });

    const voltarHome = () => {
        navigate('/homepage');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
    };

    return (
        <div className="paginas-sidebar">
            <Header toggleSidebar={toggleSidebar}/>
            {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div className='paginas-sidebar-content'>
                <div className='header-section'>
                    <div className='historico'>
                        <button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
                        <MdOutlineKeyboardArrowRight />
                        <h2>PROJETOS</h2>
                    </div>
                </div>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Pesquisar por Cliente ou Assunto"
                        value={pesquisarProjeto}
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
                                    checked={selecionarTodos && projetosFiltrados.length > 0}
                                    onChange={handleSelecionarTodos}
                                    disabled={projetosFiltrados.length === 0}
                                />
                            </th>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Assunto</th>
                            <th>Data Início</th>
                            <th>Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projetosFiltrados.map(projeto => (
                            <tr key={projeto.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selecionarProjetos.includes(projeto.id)}
                                        onChange={() => handleSelectProjeto(projeto.id)}
                                    />
                                </td>
                                <td>{projeto.id}</td>
                                <td>{projeto.cliente ? projeto.cliente.username : 'N/A'}</td>
                                <td>{projeto.assunto}</td>
                                <td>{projeto.dataInicio ? new Date(projeto.dataInicio).toLocaleDateString("pt-PT") : "Sem data"}</td>
                                <td>{projeto.valor ? `${projeto.valor} €` : 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Projetos;