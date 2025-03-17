import React, { useEffect, useState } from 'react';
import Sidebar from "../components/Sidebar";
import axios from "axios";
import "../styles/Sidebar.css";
import "../styles/Home.css"; 

const Home = () => {
   const [dashboardData, setDashboardData] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await axios.get('http://localhost:4000/dashboard/data');
            setDashboardData(response.data);
         } catch (error) {
             console.error('Erro ao pesquisar dados do dashboard:', error);
         }
      };

      fetchData();
   }, []);

   return (  
      <div className="home">
         {<Sidebar />}
         <div className="home-content">
            <h1>Dashboard</h1>
            <div className="dashboard-content">
               {dashboardData ? (
                  <div>
                     <p>Total Receita: {dashboardData.totalReceita}</p>
                     <p>Total Despesas: {dashboardData.totalDespesas}</p>
                     <p>Margem de Lucro: {dashboardData.margemLucro}%</p>
                     <p>Contas a Receber: {dashboardData.contasReceber}</p>
                     <p>Contas a Pagar: {dashboardData.contasPagar}</p>
               </div>
               ) : (
                  <p>Carregando dados...</p>
               )}
            </div>
         </div>
      </div>
   );
}
 
export default Home;