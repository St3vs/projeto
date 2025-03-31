import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import '../styles/Projetos.css';
import "../styles/Sidebar.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from 'axios';

function Projetos() {
   
   const [projetos, setProjetos] = useState([]);
   const [pesquisarProjeto, setPesquisarProjeto] = useState('');
   const [selecionarProjetos, setSelecionarProjetos] = useState([]);
   const [selecionarTodos, setSelecionarTodos] = useState(false);
   const navigate = useNavigate();
   
	useEffect(() => {
		const fetchProjetos = async () => {
			try {
				const response = await axios.get("http://localhost:4000/projetos/listarProjetos");
				setProjetos(response.data);
			} catch (error) {
				console.error("Erro ao buscar projetos:", error);
			}
		};

		fetchProjetos();
	}, []);

	const handlePesquisar = (event) => {
		setPesquisarProjeto(event.target.value);
	};

	const handleSelectProjeto = (projetoId) => {
		if (selecionarProjetos.includes(projetoId)) {
			setSelecionarProjetos(selecionarProjetos.filter(id => id !== projetoId));
		} else {
			setSelecionarProjetos([...selecionarProjetos, projetoId]);
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
          const response = await axios.delete("http://localhost:4000/projetos/eliminarProjetos", {
              data: { ids: selecionarProjetos }
          });
  
          console.log("Resposta do servidor:", response.data);
  
          const updatedProjetos = await axios.get("http://localhost:4000/projetos/listarProjetos");
          setProjetos(updatedProjetos.data);
  
          setSelecionarProjetos([]);
          setSelecionarTodos(false);
  
      } catch (error) {
          console.error("Erro ao eliminar projeto(s):", error.response ? error.response.data : error);
          alert("Erro ao eliminar projeto(s)");
      }
   };
  
	const pesquisarClientes = projetos.filter(projeto =>
      (projeto.cliente && projeto.cliente.toLowerCase().includes(pesquisarProjeto.toLowerCase())) ||
      (projeto.assunto && projeto.assunto.toLowerCase().includes(pesquisarProjeto.toLowerCase()))
   );

	const inserirNovoProjeto = () => {
		navigate('/Projetos/InserirNovoProjeto');
	};

	const voltarHome = () => {
		navigate('/homepage');
	};

	return (
		<div className="projetos">
			{<Sidebar />}
			<div className='projetos-content'>
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
						placeholder="Pesquisar por Nome do Cliente"
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
									checked={selecionarTodos}
									onChange={handleSelecionarTodos}
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
						{pesquisarClientes.map(projeto => (
							<tr key={projeto.id}>
                        <td>
									<input
                              type="checkbox"
                              checked={selecionarProjetos.includes(projeto.id)}
                              onChange={() => handleSelectProjeto(projeto.id)}
									/>
								</td>
								<td>{projeto.id}</td>
								<td>{projeto.cliente}</td>
								<td>{projeto.assunto}</td>
                        <td>{projeto.dataInicio ? new Date(projeto.dataInicio).toLocaleDateString("pt-PT") : "Sem data"}</td>
                        <td>{projeto.valor} €</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Projetos;
