import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import "../styles/Sidebar.css";
import "../styles/Home.css";
import ErrorBoundary from './ErrorBoundary';
import axios from "../api/axiosConfig";
import { apiUrl } from "../api";

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

const ChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        cx="45%"
        cy="50%"
        innerRadius={60}
        outerRadius={90}
        paddingAngle={3}
        dataKey="value"
        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }} />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

const ObrasLineChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis
        dataKey="mes"
        tickFormatter={(str) => {
          const [year, month] = str.split("-");
          return new Date(year, month - 1).toLocaleDateString('pt-PT', {
            month: 'short', year: 'numeric'
          });
        }}
      />
      <YAxis />
      <Tooltip formatter={(value) => `${value.toLocaleString()} €`} />
      <Legend />
      <Line type="monotone" dataKey="total" stroke="#007bff" name="Valor Faturado (€)" />
    </LineChart>
  </ResponsiveContainer>
);

const EncomendasBarChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid stroke="#ccc" />
      <XAxis
        dataKey="mes"
        tickFormatter={(str) => {
          const [year, month] = str.split("-");
          return new Date(year, month - 1).toLocaleDateString('pt-PT', {
            month: 'short', year: 'numeric'
          });
        }}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="quantidade" fill="#28a745" name="Nº de Encomendas" />
    </BarChart>
  </ResponsiveContainer>
);

const Home = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiUrl}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data && response.data.propostas) {
          setDashboard(response.data);
        } else {
          throw new Error('Estrutura de dados inválida');
        }
      } catch (error) {
        console.error('Erro ao pesquisar dados do dashboard:', error);
        setError(error.message);
        setDashboard({
          propostas: { aceite: 0, pendente: 0, recusada: 0 },
          projetos: { quantidade: 0, total: 0 },
          encomendas: { quantidade: 0, total: 0 },
          obras: { quantidade: 0, total: 0 },
          obrasPorMes: [],
          encomendasPorMes: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value || 0);

  const pieData = dashboard
    ? [
        { name: "Aceites", value: dashboard.propostas.aceite },
        { name: "Pendentes", value: dashboard.propostas.pendente },
        { name: "Recusadas", value: dashboard.propostas.recusada },
      ]
    : [];

  if (loading) {
    return (
      <div className="home">
        <Sidebar />
        <div className="home-content">
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className="home">
      <Header toggleSidebar={toggleSidebar} onThemeChange={handleThemeChange} />
      {isSidebarOpen && <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="home-content">
        {error && <div className="error-message">Erro: {error}</div>}

        <div className="dashboard-content">
          <div className="stats-container">
            <div className="dashboard-section">
              <h2>Projetos</h2>
              <p>Quantidade: {dashboard?.projetos?.quantidade || 0}</p>
              <p>Valor Total: {formatCurrency(dashboard?.projetos?.total)}</p>
            </div>

            <div className="dashboard-section">
              <h2>Encomendas</h2>
              <p>Quantidade: {dashboard?.encomendas?.quantidade || 0}</p>
              <p>Total Gasto: {formatCurrency(dashboard?.encomendas?.total)}</p>
            </div>

            <div className="dashboard-section">
              <h2>Obras</h2>
              <p>Quantidade: {dashboard?.obras?.quantidade || 0}</p>
              <p>Total Faturado: {formatCurrency(dashboard?.obras?.total)}</p>
            </div>
          </div>

         <div className="charts-row">
            <div className="chart-box">
               <h3>Propostas</h3>
               <ErrorBoundary>
                  <ChartComponent data={pieData} />
               </ErrorBoundary>
            </div>

            <div className="chart-box">
               <h3>Valor Faturado das Obras (Mensal)</h3>
               <ErrorBoundary>
                  <ObrasLineChart data={dashboard.obrasPorMes || []} />
               </ErrorBoundary>
            </div>

            <div className="chart-box">
               <h3>Encomendas Mensais</h3>
               <ErrorBoundary>
                  <EncomendasBarChart data={dashboard.encomendasPorMes || []} />
               </ErrorBoundary>
            </div>
         </div>
        </div>
      </div>
    </div>
  );
};

export default Home;