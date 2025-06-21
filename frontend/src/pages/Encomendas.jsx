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

function Encomendas() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [encomendas, setEncomendas] = useState([]);
   const [pesquisarEncomenda, setPesquisarEncomenda] = useState('');
   const [selecionarEncomendas, setSelecionarEncomendas] = useState([]);
   const [selecionarTodas, setSelecionarTodas] = useState(false);
   const navigate = useNavigate();
   
   
   useEffect(() => {
		const fetchEncomendas = async () => {
			try {
            const token = localStorage.getItem('token'); 
				//const response = await axios.get("http://localhost:4000/encomendas/listarEncomendas", {
            const response = await axios.get(`${apiUrl}/encomendas/listarEncomendas`, {
               headers: {
                  Authorization: `Bearer ${token}`
               }
            });
				setEncomendas(response.data);
			} catch (error) {
				console.error("Erro ao encontrar encomendas:", error);
			}
		};

		fetchEncomendas();
	}, []);
   

	const handlePesquisar = (event) => {
		setPesquisarEncomenda(event.target.value);
	};

	const handleSelectEncomenda = (encomendaId) => {
		if (selecionarEncomendas.includes(encomendaId)) {
			setSelecionarEncomendas(selecionarEncomenda.filter(id => id !== encomendaId));
		} else {
			setSelecionarEncomendas([...selecionarEncomendas, encomendaId]);
		}
	};

	const handleSelecionarTodas = () => {
		if (selecionarTodas) {
			setSelecionarEncomendas([]);
		} else {
			const allEncomendasIds = encomendas.map(encomenda => encomenda.id);
			setSelecionarEncomendas(allEncomendasIds);
		}
		setSelecionarTodas(!selecionarTodas);
	};

   
   const handleDeleteSelected = async () => {
      if (selecionarEncomendas.length === 0) {
          alert("Nenhuma encomenda selecionada!");
          return;
      }
  
      try {
         const token = localStorage.getItem('token'); // pegar token
         //const response = await axios.delete("http://localhost:4000/encomendas/eliminarEncomendas", {
         const response = await axios.delete(`${apiUrl}/encomendas/eliminarEncomendas`, {
            headers: {
               Authorization: `Bearer ${token}`
            },
            data: { ids: selecionarEncomendas }
         });

         console.log("Resposta do servidor:", response.data);

         //const updatedEncomendas = await axios.get("http://localhost:4000/encomendas/listarEncomendas", {
         const updatedEncomendas = await axios.get(`${apiUrl}/encomendas/listarEncomendas`, {
            headers: {
               Authorization: `Bearer ${token}`
            }
         });
         setEncomendas(updatedEncomendas.data);

         // Limpar as seleções
         setSelecionarEncomendas([]);
         setSelecionarTodas(false);

      } catch (error) {
         console.error("Erro ao eliminar encomenda(s):", error.response ? error.response.data : error);
         alert("Erro ao eliminar encomenda(s)");
      }
   };

   const pesquisarFornecedor = encomendas.filter(encomenda =>
      (encomenda.fornecedor && typeof encomenda.fornecedor === 'object' && encomenda.fornecedor.username.toLowerCase().includes(pesquisarEncomenda.toLowerCase())) ||
      (encomenda.contacto && encomenda.contacto.includes(pesquisarEncomenda))
   );

	const inserirNovaEncomenda = () => {
		navigate('/Encomendas/InserirNovaEncomenda');
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
						<h2>ENCOMENDAS</h2>
					</div>
				</div>
				<div className='criarFichaButton'>
					<button className='criarFicha' onClick={inserirNovaEncomenda}>Inserir Nova Encomenda</button>
				</div>
				<div className="search-bar">
					<input
						type="text"
						placeholder="Pesquisar por Nome ou Contacto do fornecedor"
                  value={pesquisarEncomenda}
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
							<th>ID da Encomenda</th>
							<th>Fornecedor</th>
                     <th>ID da Obra</th>
							<th>Descrição do Material</th>
                     <th>Data</th>
                     <th>Data de Entrega</th>
							<th>Valor</th>
						</tr>
					</thead>
					<tbody>
                  {pesquisarFornecedor.map(encomenda => (
                     <tr 
                        key={encomenda.id} 
                        onClick={() => navigate(`/encomendas/atualizarEncomenda/${encomenda.id}`)}
                        className="clickable-row"
                     >
                        <td onClick={(e) => e.stopPropagation()}>
                        <input
                           type="checkbox"
                           checked={selecionarEncomendas.includes(encomenda.id)}
                           onChange={() => handleSelectEncomenda(encomenda.id)}
                        />
                        </td>
                        <td>{encomenda.id}</td>
                        <td>{encomenda.fornecedor?.username || "Sem fornecedor"}</td>
                        <td>{encomenda.obraId || "Sem obra"}</td>
                        <td>{encomenda.descricaoMaterial}</td>
                        <td>{encomenda.data ? new Date(encomenda.data).toLocaleDateString("pt-PT") : "Sem data"}</td>
                        <td>{encomenda.previsaoEntrega ? new Date(encomenda.previsaoEntrega).toLocaleDateString("pt-PT") : "Sem data"}</td>
                        <td>{encomenda.valor} €</td>
                     </tr>
                  ))}
               </tbody>
				</table>
			</div>
		</div>
	);
}

export default Encomendas;