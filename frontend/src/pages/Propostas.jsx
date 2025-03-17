import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import '../styles/Propostas.css';
import "../styles/Sidebar.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from 'axios';

function Propostas() {
   
   const [propostas, setPropostas] = useState([]);
   const [pesquisarProposta, setPesquisarProposta] = useState('');
   const [selecionarPropostas, setSelecionarPropostas] = useState([]);
   const [selecionarTodas, setSelecionarTodas] = useState(false);
   const navigate = useNavigate();
   
   
	useEffect(() => {
		const fetchPropostas = async () => {
			try {
				const response = await axios.get("http://localhost:4000/propostas/listarPropostas");
				setPropostas(response.data);
			} catch (error) {
				console.error("Erro ao encontrar propostas:", error);
			}
		};

		fetchPropostas();
	}, []);
   

	const handlePesquisar = (event) => {
		setPesquisarProposta(event.target.value);
	};

	const handleSelectProposta = (propostaId) => {
		if (selecionarPropostas.includes(propostaId)) {
			setSelecionarPropostas(selecionarProposta.filter(id => id !== propostaId));
		} else {
			setSelecionarPropostas([selecionarPropostas, propostaId]);
		}
	};

	const handleSelecionarTodas = () => {
		if (selecionarTodas) {
			setSelecionarPropostas([]);
		} else {
			const allPropostasIds = propostas.map(proposta => proposta._id);
			setSelecionarPropostas(allPropostasIds);
		}
		setSelecionarTodas(!selecionarTodas);
	};

   /*
	const handleDeleteSelected = async () => {
		if (selecionarClientes.length === 0) {
			alert("Nenhum cliente selecionado!");
			return;
		}

		console.log("IDs a eliminar:", selecionarClientes);

		try {
			const response = await axios.delete("http://localhost:4000/clientes/eliminarClientes", {
					data: { ids: selecionarClientes }
			});

			console.log("Resposta do servidor:", response.data);
			setPropostas(prevClientes => prevClientes.filter(client => !selecionarClientes.includes(client._id)));
			setSelecionarClientes([]);
			setSelecionarTodos(false);

			alert("Cliente(s) eliminado(s) com sucesso!");
		} catch (error) {
			console.error("Erro ao eliminar cliente(s):", error.response ? error.response.data : error);
			alert("Erro ao eliminar cliente(s)");
		}
	};
   */ 


	const pesquisarCliente = propostas.filter(proposta =>
		proposta.username.toLowerCase().includes(pesquisarProposta.toLowerCase()) ||
		proposta.contacto.includes(pesquisarProposta)
	);

	const inserirNovaProposta = () => {
		navigate('/Propostas/InserirNovaProposta');
	};

	const voltarHome = () => {
		navigate('/homepage');
	};

	return (
		<div className="clientes">
			{<Sidebar />}
			<div className='clientes-content'>
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
					<button className="delete-button" /*onClick={handleDeleteSelected}*/>
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
							<th>Valor</th>
                     <th>Estado</th>
						</tr>
					</thead>
					<tbody>
						{pesquisarCliente.map(proposta => (
							<tr key={proposta._id}>
                        <td>
									<input
                              type="checkbox"
                              checked={selecionarPropostas.includes(proposta._id)}
                              onChange={() => handleSelectProposta(proposta._id)}
									/>
								</td>
								<td>{proposta._id}</td>
								<td>{proposta.cliente}</td>
								<td>{proposta.assunto}</td>
								<td>{proposta.data}</td>
                        <td>{proposta.valor}</td>
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