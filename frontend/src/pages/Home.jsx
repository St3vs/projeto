import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import "../styles/Sidebar.css";
import "../styles/Home.css";
import ErrorBoundary from './ErrorBoundary';
import axios from "../api/axiosConfig";

const COLORS = ["#4caf50", "#ff9800", "#f44336"];

const ChartComponent = ({ data }) => (
   <ResponsiveContainer width="100%" height={300} >
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
      <Tooltip
         contentStyle={{ backgroundColor: '#fff', borderColor: '#ddd' }}
         formatter={(value, name) => [`${value}`, `${name}`]}
      />
      <Legend />
   </PieChart>
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
         // Pega o token do localStorage (ou de onde você guarda)
         const token = localStorage.getItem('token');

         // Faz a requisição incluindo o token no header Authorization
         const response = await axios.get('http://localhost:4000/dashboard', {
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
         obras: { quantidade: 0, total: 0 }
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

   console.log("Pie Data:", pieData); // Debug

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
            <div className="dashboard-section">
               <h2>Propostas</h2>
               <ErrorBoundary>
               <ChartComponent data={pieData} />
               </ErrorBoundary>
            </div>
         </div>
         </div>
      </div>
   );
};

export default Home;
