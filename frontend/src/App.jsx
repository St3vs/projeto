//app.jsx
import { React, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Home";
import CriarFichaCliente from "./pages/CriarFichaCliente";
import Clientes from "./pages/Clientes";
import Propostas from "./pages/Propostas";
import InserirNovaProposta from "./pages/InserirNovaProposta";
import Perfil from "./pages/Perfil";
import PrivateRoute from "./components/PrivateRoute";
import Fornecedores from "./pages/Fornecedores";
import CriarFichaFornecedor from "./pages/CriarFichaFornecedor";
import EditarPerfil from "./pages/EditarPerfil";
import Projetos from "./pages/Projetos";
import EditarProposta from "./pages/EditarProposta";
import Encomendas from "./pages/Encomendas";
import AdicionarEncomenda from "./pages/AdicionarEncomenda";
import AtualizarEncomenda from "./pages/EditarEncomenda";
import Obras from "./pages/Obras";
import AdicionarObra from "./pages/AdicionarObra";
import EditarObra from "./pages/EditarObra";
import AtualizarFichaFornecedor from "./pages/AtualizarFichaFornecedor";
import AtualizarFichaCliente from "./pages/AtualizarFichaCliente";

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
            <Route path="/Clientes/AtualizarFichaCliente/:id" element={<PrivateRoute><AtualizarFichaCliente /></PrivateRoute>} />
            <Route path="/Perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
            <Route path="/Perfil/EditarPerfil" element={<PrivateRoute><EditarPerfil /></PrivateRoute>} />
            <Route path="/Propostas" element={<PrivateRoute><Propostas /></PrivateRoute>} />
            <Route path="/Propostas/InserirNovaProposta" element={<PrivateRoute><InserirNovaProposta /></PrivateRoute>} />
            <Route path="/Propostas/EditarProposta/:id" element={<PrivateRoute><EditarProposta /></PrivateRoute>} />
            <Route path="/Projetos" element={<PrivateRoute><Projetos /></PrivateRoute>} />
            <Route path="/Fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
            <Route path="/Fornecedores/CriarFichaFornecedor" element={<PrivateRoute><CriarFichaFornecedor/></PrivateRoute>} />
            <Route path="/Fornecedores/AtualizarFichaFornecedor/:id" element={<PrivateRoute><AtualizarFichaFornecedor /></PrivateRoute>} />
            <Route path="/Encomendas" element={<PrivateRoute><Encomendas /></PrivateRoute>} />
            <Route path="/Encomendas/InserirNovaEncomenda" element={<PrivateRoute><AdicionarEncomenda/></PrivateRoute>} />
            <Route path="/Encomendas/AtualizarEncomenda/:id" element={<PrivateRoute><AtualizarEncomenda /></PrivateRoute>} />
            <Route path="/Obras" element={<PrivateRoute><Obras/></PrivateRoute>} />
            <Route path="/Obras/InserirNovaObra" element={<PrivateRoute><AdicionarObra/></PrivateRoute>} />
            <Route path="/obras/EditarObra/:id" element={<PrivateRoute><EditarObra/></PrivateRoute>} />
         </Routes>
         </Router>
      </AuthProvider>
   );
}

export default App;
