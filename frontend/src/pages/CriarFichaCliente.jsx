import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Formularios.css';
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import "../styles/Sidebar.css";
import Sidebar from "../components/Sidebar";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FaHouse } from "react-icons/fa6";
import Header from "../components/Header";
import { apiUrl } from "../api";

const CriarFichaCliente = () => {
	const [username, setUser] = useState('');
	const [email, setEmail] = useState('');
	const [contacto, setContacto] = useState('');
	const [nif, setNIF] = useState('');
	const [morada, setMorada] = useState('');
	const [cp, setCP] = useState('');
	const [localidade, setLocalidade] = useState('');
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const navigate = useNavigate();

	const voltarHome = () => {
		navigate('/homepage');
	};

	const voltarClientes = () => {
		navigate('/Clientes');
	};

	const handleCriarFicha = async (e) => {
		e.preventDefault();
	
		if (contacto.replace(/\D/g, '').length !== 9) {
			alert("O contacto deve conter exatamente 9 dígitos.");
			return;
		}
	
		if (nif.length !== 9 || isNaN(nif)) {
			alert("O NIF deve conter exatamente 9 dígitos numéricos.");
			return;
		}
	
		try {
			const token = localStorage.getItem('token'); // Pega o token JWT

			const response = await axios.post(
				//'http://localhost:4000/clientes/criarFichaCliente',
            `${apiUrl}/clientes/criarFichaCliente`,
				{
					username,
					email,
					contacto,
					nif,
					morada,
					cp,
					localidade
				},
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
	
			if (response.status === 201) {
				alert('Ficha de cliente criada com sucesso!');
			}
		} catch (error) {
			if (error.response) {
				console.error('Erro do backend:', error.response.data);
				alert(error.response.data.error);
			} else {
				console.error('Erro de rede ou outro erro:', error);
				alert('Ocorreu um erro ao tentar registar. Tente novamente.');
			}
		}
	};

   const toggleSidebar = () => {
      setIsSidebarOpen(prev => !prev);
   };

   return (
		<div className="inserir">
			
         <Header toggleSidebar={toggleSidebar}/>
         {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
         <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

			<div className='content-formulario'>
					<div className='header-section'>
						<div className='historico'>
							<button className='voltarHome' onClick={voltarHome}><FaHouse /></button>
							<MdOutlineKeyboardArrowRight />
							<button className='voltarHome' onClick={voltarClientes}>CLIENTES</button>
							<MdOutlineKeyboardArrowRight />
							<h2>Criar Ficha de Cliente</h2>
						</div>
					</div>
					<div>
						<form className='inserir-novo' onSubmit={handleCriarFicha}>
							<h1>Criar Ficha de Cliente</h1>
							<div className="form-group">
								<label htmlFor="nome">Nome de Utilizador/Empresa:</label>
								<input 
									type="text" 
									id="nome" 
									name="nome" 
									placeholder="Insira o nome"
									value={username}
									onChange={(e) => setUser(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="email">Email:</label>
								<input 
									type="email" 
									id="email" 
									name="email" 
									placeholder="Insira o Email" 
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="contacto">Contacto:</label>
									<input 
										type="text" 
										id="contacto" 
										name="contacto" 
										placeholder="Insira o contacto"
										value={contacto}
										onChange={(e) => {
												const value = e.target.value.replace(/\D/g, '').slice(0, 9);
												setContacto(value);
										}} 
									/>
								</div>
								<div className="form-group">
									<label htmlFor="nif">NIF:</label>
									<input 
										type="text" 
										id="nif" 
										name="nif" 
										placeholder="Insira o NIF" 
										value={nif}
										onChange={(e) => {
												const value = e.target.value.replace(/\D/g, '').slice(0, 9);
												setNIF(value);
										}}
									/>
								</div>
							</div>
							<div className="form-group">
								<label htmlFor="morada">Morada:</label>
								<input 
									type="text" 
									id="morada" 
									name="morada" 
									placeholder="Insira a morada"
									value={morada}
									onChange={(e) => setMorada(e.target.value)} 
								/>
							</div>
							<div className="form-row">
								<div className="form-group">
									<label htmlFor="codigoPostal">Código-Postal:</label>
									<input 
										type="text" 
										id="codigoPostal" 
										name="codigoPostal" 
										placeholder="Insira o código-postal" 
										value={cp}
										onChange={(e) => {
												let value = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
												if (value.length > 4) {
													value = value.slice(0, 4) + "-" + value.slice(4, 7); // Formata como XXXX-XXX
												}
												setCP(value);
										}} 
										maxLength={8} // Impede que o utilizador digitar mais caracteres
									/>
								</div>
								<div className="form-group">
									<label htmlFor="localidade">Localidade:</label>
									<input 
										type="text" 
										id="localidade" 
										name="localidade" 
										placeholder="Insira a localidade" 
										value={localidade}
										onChange={(e) => setLocalidade(e.target.value)} 
									/>
								</div>
							</div>
							<div className="buttons">
								<button type="submit" className="save"><FaCheckCircle /> GUARDAR</button>
								<button type="button" className="cancel" onClick={voltarClientes}><FaCircleXmark /> CANCELAR</button>
							</div>
						</form>
					</div>
			</div>
		</div>
    );
};

export default CriarFichaCliente;