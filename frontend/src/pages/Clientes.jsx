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

function ClientPage() {
   const [clientes, setClientes] = useState([]);
   const [pesquisarCliente, setPesquisarCliente] = useState('');
   const [selecionarClientes, setSelecionarClientes] = useState([]);
   const [selecionarTodos, setSelecionarTodos] = useState(false);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const navigate = useNavigate();

   useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/');
         return;
      }

      const fetchClientes = async () => {
         try {
            //const response = await axios.get("http://localhost:4000/clientes/listarClientes", {
            const response = await axios.get(`${apiUrl}/clientes/listarClientes`, {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });
            setClientes(response.data);
         } catch (error) {
            console.error("Erro ao encontrar fichas de clientes:", error);
            // Se token inválido ou outro erro crítico, redireciona para login
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
               navigate('/');
            }
         }
      };

      fetchClientes();
   }, [navigate]);

	const handleSearch = (event) => {
		setPesquisarCliente(event.target.value);
	};

	const handleSelectClient = (clientId) => {
		if (selecionarClientes.includes(clientId)) {
			setSelecionarClientes(selecionarClientes.filter(id => id !== clientId));
		} else {
			setSelecionarClientes([...selecionarClientes, clientId]);
		}
	};

	const handleSelecionarTodos = () => {
		if (selecionarTodos) {
			setSelecionarClientes([]);
		} else {
			const allClientIds = clientes.map(client => client.id);
			setSelecionarClientes(allClientIds);
		}
		setSelecionarTodos(!selecionarTodos);
	};

   const handleDeleteSelected = async () => {
      if (selecionarClientes.length === 0) {
         alert("Nenhum cliente selecionado!");
         return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
         navigate('/');
         return;
      }

      try {
         await axios.delete("http://localhost:4000/clientes/eliminarClientes", {
            headers: {
               Authorization: `Bearer ${token}`
            },
            data: { ids: selecionarClientes }
         });

         // Recarregar os clientes do backend
         const updatedClientes = await axios.get("http://localhost:4000/clientes/listarClientes", {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });
         setClientes(updatedClientes.data);

         // Limpar as seleções
         setSelecionarClientes([]);
         setSelecionarTodos(false);

      } catch (error) {
         console.error("Erro ao eliminar cliente(s):", error.response ? error.response.data : error);
         if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            navigate('/');
         } else {
            alert("Erro ao eliminar cliente(s)");
         }
      }
   };

	const filteredClientes = clientes.filter(client =>
		client.username.toLowerCase().includes(pesquisarCliente.toLowerCase()) ||
		client.contacto.includes(pesquisarCliente)
	);

	const criarFicha = () => {
		navigate('/Clientes/CriarFichaCliente');
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
						<h2>CLIENTES</h2>
					</div>
				</div>
				<div className='criarFichaButton'>
					<button className='criarFicha' onClick={criarFicha}>Criar Ficha de Cliente</button>
				</div>
				<div className="search-bar">
					<input
						type="text"
						placeholder="Pesquisar por Nome ou Contacto"
						value={pesquisarCliente}
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
						{filteredClientes.map(client => (
							<tr key={client.id}>
								<td>
									<input
                              type="checkbox"
                              checked={selecionarClientes.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
									/>
								</td>
								<td>{client.id}</td>
								<td>{client.username}</td>
								<td>{client.email}</td>
								<td>{client.contacto}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default ClientPage;