import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar";
import '../styles/Fornecedores.css';
import "../styles/Sidebar.css";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import axios from 'axios';

function FornecedoresPage() {
   const [fornecedores, setFornecedores] = useState([]);
   const [pesquisarFornecedor, setPesquisarFornecedor] = useState('');
   const [selecionarFornecedores, setSelecionarFornecedores] = useState([]);
   const [selecionarTodos, setSelecionarTodos] = useState(false);
   const navigate = useNavigate();

	useEffect(() => {
		const fetchFornecedores = async () => {
			try {
				const response = await axios.get("http://localhost:4000/fornecedores/listarFornecedores");
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
			const allFornecedorIds = fornecedores.map(fornecedor => fornecedor._id);
			setSelecionarFornecedores(allFornecedorIds);
		}
		setSelecionarTodos(!selecionarTodos);
	};

	const handleDeleteSelected = async () => {
		if (selecionarFornecedores.length === 0) {
			alert("Nenhum fornecedor selecionado!");
			return;
		}

		console.log("IDs a eliminar:", selecionarFornecedores);

		try {
			const response = await axios.delete("http://localhost:4000/fornecedores/eliminarFornecedores", {
					data: { ids: selecionarFornecedores }
			});

			console.log("Resposta do servidor:", response.data);
			setFornecedore(prevFornecedores => prevFornecedores.filter(fornecedor => !selecionarFornecedores.includes(fornecedor._id)));
			setSelecionarFornecedores([]);
			setSelecionarTodos(false);

			alert("Fornecedor(es) eliminado(es) com sucesso!");
		} catch (error) {
			console.error("Erro ao eliminar fornecedor(s):", error.response ? error.response.data : error);
			alert("Erro ao eliminar fornecedor(s)");
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

	return (
		<div className="fornecedores">
			{<Sidebar />}
			<div className='fornecedor-content'>
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
							<tr key={fornecedor._id}>
								<td>
									<input
                              type="checkbox"
                              checked={selecionarFornecedores.includes(fornecedor._id)}
                              onChange={() => handleSelectFornecedor(fornecedor._id)}
									/>
								</td>
								<td>{fornecedor._id}</td>
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