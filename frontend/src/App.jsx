//app.jsx
import { React, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Home";
import CriarFichaCliente from "./pages/CriarFichaCliente";
import Clientes from "./pages/Clientes";
import Propostas from "./pages/Propostas";
import InserirNovaProposta from "./pages/InserirNovaProposta";
import Conta from "./pages/Conta";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Fornecedores from "./pages/Fornecedores";
import CriarFichaFornecedor from "./pages/CriarFichaFornecedor";
import EditarPerfil from "./pages/EditarPerfil";
import Projetos from "./pages/Projetos";
import EditarProposta from "./pages/EditarProposta";
import Encomendas from "./pages/Encomendas";
import AdicionarEncomenda from "./pages/AdicionarEncomenda";
import Obras from "./pages/Obras";
import AdicionarObra from "./pages/AdicionarObra";
import "./styles/Index.css";

function App() {

   useEffect(() => {
      fetch("http://localhost:4000/")
         .then((res) => res.text())
   }, []);

   return (
      <AuthProvider>
         <Router>
         <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/Register" element={<Register />} />

            {/* Rotas protegidas */}
            <Route path="/Homepage" element={<PrivateRoute><Homepage /></PrivateRoute>} />
            <Route path="/Clientes/CriarFichaCliente" element={<PrivateRoute><CriarFichaCliente /></PrivateRoute>} />
            <Route path="/Clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
            <Route path="/Conta" element={<PrivateRoute><Conta /></PrivateRoute>} />
            <Route path="/Conta/EditarPerfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
            <Route path="/Propostas" element={<PrivateRoute><Propostas /></PrivateRoute>} />
            <Route path="/Propostas/InserirNovaProposta" element={<PrivateRoute><InserirNovaProposta /></PrivateRoute>} />
            <Route path="/Propostas/EditarProposta/:id" element={<PrivateRoute><EditarProposta /></PrivateRoute>} />
            <Route path="/Projetos" element={<PrivateRoute><Projetos /></PrivateRoute>} />
            <Route path="/Fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
            <Route path="/Fornecedores/CriarFichaFornecedor" element={<PrivateRoute><CriarFichaFornecedor/></PrivateRoute>} />
            <Route path="/Encomendas" element={<PrivateRoute><Encomendas /></PrivateRoute>} />
            <Route path="/Encomendas/InserirNovaEncomenda" element={<PrivateRoute><AdicionarEncomenda/></PrivateRoute>} />
            <Route path="/Obras" element={<PrivateRoute><Obras/></PrivateRoute>} />
            <Route path="/Obras/InserirNovaObra" element={<PrivateRoute><AdicionarObra/></PrivateRoute>} />
         </Routes>
         </Router>
      </AuthProvider>
   );
}

export default App;
