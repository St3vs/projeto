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

function Propostas() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [propostas, setPropostas] = useState([]);
   const [pesquisarProposta, setPesquisarProposta] = useState('');
   const [selecionarPropostas, setSelecionarPropostas] = useState([]);
   const [selecionarTodas, setSelecionarTodas] = useState(false);
   const navigate = useNavigate();
   
   // Obter token do localStorage
   const token = localStorage.getItem("token");

   const fetchPropostas = async () => {
      try {
         const response = await axios.get("http://localhost:4000/propostas/listarPropostas", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setPropostas(response.data);
      } catch (error) {
         console.error("Erro ao buscar propostas:", error);
      }
   };

   useEffect(() => {
      if (!token) {
         navigate("/login");
      } else {
         fetchPropostas();
      }
   }, []);
   

	const handlePesquisar = (event) => {
		setPesquisarProposta(event.target.value);
	};

	const handleSelectProposta = (propostaId) => {
		if (selecionarPropostas.includes(propostaId)) {
			setSelecionarPropostas(selecionarPropostas.filter(id => id !== propostaId));
		} else {
			setSelecionarPropostas([...selecionarPropostas, propostaId]);
		}
	};

	const handleSelecionarTodas = () => {
		if (selecionarTodas) {
			setSelecionarPropostas([]);
		} else {
			const allPropostasIds = propostas.map(proposta => proposta.id);
			setSelecionarPropostas(allPropostasIds);
		}
		setSelecionarTodas(!selecionarTodas);
	};

   
   const handleDeleteSelected = async () => {
      if (selecionarPropostas.length === 0) {
          alert("Nenhuma proposta selecionada!");
          return;
      }
  
      try {
         const response = await axios.delete("http://localhost:4000/propostas/eliminarPropostas", {
            headers: {
               Authorization: `Bearer ${token}`,
            },  
            data: { ids: selecionarPropostas }
         });

         console.log("Resposta do servidor:", response.data);

         // Recarregar as propostas do backend para refletir os novos IDs
         const updatedPropostas = await axios.get("http://localhost:4000/propostas/listarPropostas", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });
         setPropostas(updatedPropostas.data);

         // Limpar as seleções
         setSelecionarPropostas([]);
         setSelecionarTodas(false);

      } catch (error) {
         console.error("Erro ao eliminar proposta(s):", error.response ? error.response.data : error);
         alert("Erro ao eliminar proposta(s)");
      }
   };

	const pesquisarCliente = propostas.filter(proposta =>
      (proposta.cliente && proposta.cliente.toLowerCase().includes(pesquisarProposta.toLowerCase())) ||
      (proposta.contacto && proposta.contacto.includes(pesquisarProposta))
   );

	const inserirNovaProposta = () => {
		navigate('/Propostas/InserirNovaProposta');
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
						<h2>PROPOSTAS</h2>
					</div>
				</div>
				<div className='criarFichaButton'>
					<button className='criarFicha' onClick={inserirNovaProposta}>Inserir Nova Proposta</button>
				</div>
				<div className="search-bar">
					<input
						type="text"
						placeholder="Pesquisar por Nome ou Contacto do cliente"
						value={pesquisarProposta}
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
							<th>Assunto</th>
                     <th>Data</th>
							<th>Valor</th>
                     <th>Estado</th>
						</tr>
					</thead>
					<tbody>
                  {pesquisarCliente.map(proposta => (
                     <tr 
                        key={proposta.id} 
                        onClick={() => navigate(`/Propostas/EditarProposta/${proposta.id}`)}
                        className="clickable-row"
                     >
                        <td onClick={(e) => e.stopPropagation()}>
                           <input
                              type="checkbox"
                              checked={selecionarPropostas.includes(proposta.id)}
                              onChange={() => handleSelectProposta(proposta.id)}
                           />
                        </td>
                        <td>{proposta.id}</td>
                        <td>{proposta.cliente}</td>
                        <td>{proposta.assunto}</td>
                        <td>{proposta.data ? new Date(proposta.data).toLocaleDateString("pt-PT") : "Sem data"}</td>
                        <td>{proposta.valor} €</td>
                        <td>{proposta.estado}</td>
                     </tr>
                  ))}
               </tbody>
				</table>
			</div>
		</div>
	);
}

export default Propostas;