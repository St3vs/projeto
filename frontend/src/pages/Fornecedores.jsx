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

function FornecedoresPage() {
   const [fornecedores, setFornecedores] = useState([]);
   const [pesquisarFornecedor, setPesquisarFornecedor] = useState('');
   const [selecionarFornecedores, setSelecionarFornecedores] = useState([]);
   const [selecionarTodos, setSelecionarTodos] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchFornecedores = async () => {
         try {
            const token = localStorage.getItem('token');
            //const response = await axios.get("http://localhost:4000/fornecedores/listarFornecedores", {
            const response = await axios.get(`${apiUrl}/fornecedores/listarFornecedores`, { 
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });
            setFornecedores(response.data);
         } catch (error) {
            console.error("Erro ao encontrar fichas de fornecedor:", error);
         }
      };

      fetchFornecedores();
   }, []);

	const handleSearch = (event) => {
		setPesquisarFornecedor(event.target.value);
	};

	const handleSelectFornecedor = (fornecedorId) => {
		if (selecionarFornecedores.includes(fornecedorId)) {
			setSelecionarFornecedores(selecionarFornecedores.filter(id => id !== fornecedorId));
		} else {
			setSelecionarFornecedores([...selecionarFornecedores, fornecedorId]);
		}
	};

	const handleSelecionarTodos = () => {
		if (selecionarTodos) {
			setSelecionarFornecedores([]);
		} else {
			const allFornecedorIds = fornecedores.map(fornecedor => fornecedor.id);
			setSelecionarFornecedores(allFornecedorIds);
		}
		setSelecionarTodos(!selecionarTodos);
	};

   const handleDeleteSelected = async () => {
      if (selecionarFornecedores.length === 0) {
         alert("Nenhum fornecedor selecionado!");
         return;
      }

      try {
         const token = localStorage.getItem('token');

         //const response = await axios.delete("http://localhost:4000/fornecedores/eliminarFornecedores", {
         const response = await axios.delete(`${apiUrl}/fornecedores/eliminarFornecedores`, {
            headers: {
               Authorization: `Bearer ${token}`
            },
            data: { ids: selecionarFornecedores }
         });

         console.log("Resposta do servidor:", response.data);

         //const updatedFornecedores = await axios.get("http://localhost:4000/fornecedores/listarFornecedores", {
         const updatedFornecedores = await axios.get(`${apiUrl}/fornecedores/listarFornecedores`, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });
         setFornecedores(updatedFornecedores.data);

         // Limpar as seleções
         setSelecionarFornecedores([]);
         setSelecionarTodos(false);

      } catch (error) {
         console.error("Erro ao eliminar fornecedor(es):", error.response ? error.response.data : error);
         alert("Erro ao eliminar fornecedor(es)");
      }
   };

	const filteredFornecedores = fornecedores.filter(fornecedor =>
		fornecedor.username.toLowerCase().includes(pesquisarFornecedor.toLowerCase()) ||
		fornecedor.contacto.includes(pesquisarFornecedor)
	);

	const criarFicha = () => {
		navigate('/Fornecedores/CriarFichaFornecedor');
	};

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
						<h2>FORNECEDORES</h2>
					</div>
				</div>
				<div className='criarFichaButton'>
					<button className='criarFicha' onClick={criarFicha}>Criar Ficha de Fornecedores</button>
				</div>
				<div className="search-bar">
					<input
						type="text"
						placeholder="Pesquisar por Nome ou Contacto"
						value={pesquisarFornecedor}
						onChange={handleSearch}
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
									checked={selecionarTodos}
									onChange={handleSelecionarTodos}
								/>
							</th>
							<th>ID</th>
							<th>Nome</th>
							<th>Email</th>
							<th>Contacto</th>
						</tr>
					</thead>
					<tbody>
						{filteredFornecedores.map(fornecedor => (
							<tr key={fornecedor.id}>
								<td>
									<input
                              type="checkbox"
                              checked={selecionarFornecedores.includes(fornecedor.id)}
                              onChange={() => handleSelectFornecedor(fornecedor.id)}
									/>
								</td>
								<td>{fornecedor.id}</td>
								<td>{fornecedor.username}</td>
								<td>{fornecedor.email}</td>
								<td>{fornecedor.contacto}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default FornecedoresPage;