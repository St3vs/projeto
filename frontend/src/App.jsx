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

function App() {

  useEffect(() => {
    fetch("http://localhost:4000")
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
          <Route path="/Propostas" element={<PrivateRoute><Propostas /></PrivateRoute>} />
          <Route path="/Propostas/InserirNovaProposta" element={<PrivateRoute><InserirNovaProposta /></PrivateRoute>} />
          <Route path="/Fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
          <Route path="/Fornecedores/CriarFichaFornecedor" element={<PrivateRoute><CriarFichaFornecedor/></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
