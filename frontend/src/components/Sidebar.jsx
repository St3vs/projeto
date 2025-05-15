import "../styles/Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { IoPerson } from 'react-icons/io5';
import { FaHouse } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdConstruction, MdAssignment } from 'react-icons/md';
import { FaTruck, FaProjectDiagram } from 'react-icons/fa';
import { FiPackage } from "react-icons/fi";
import logo from '../images/logoBranco.png';


const Sidebar = () => {
    const location = useLocation();
    return (
        <div className="Sidebar">
            <img src={logo} alt="Logo" className="logo" /> {}
            <h1>FlowBiz</h1>
            <nav>
               <ul>
                  <li>
                     <Link to="/Homepage" className={location.pathname === "/Homepage" ? "active" : ""}><FaHouse size={25}/> <span>Home</span></Link>
                  </li>
                  <li>
                     <Link to="/Conta" className={location.pathname === "/Conta" ? "active" : ""}><IoPerson size={25} /> <span>Conta</span></Link>
                  </li>
                  <li>
                     <Link to="/Clientes" className={location.pathname === "/Clientes" ? "active" : ""}><BsFillPeopleFill size={25}/> <span>Clientes</span></Link>
                  </li>
                  <li>
                     <Link to="/Propostas" className={location.pathname === "/Propostas" ? "active" : ""}><MdAssignment size={25}/> <span>Propostas</span></Link>
                  </li>
                  <li>
                     <Link to="/Projetos" className={location.pathname === "/Projetos" ? "active" : ""}><FaProjectDiagram size={25}/> <span>Projetos</span></Link>
                  </li>
                  <li>
                     <Link to="/Fornecedores" className={location.pathname === "/Fornecedores" ? "active" : ""}><FaTruck size={25}/> <span>Fornecedores</span></Link>
                  </li>
                  <li>
                     <Link to="/Encomendas" className={location.pathname === "/Encomendas" ? "active" : ""}><FiPackage  size={25}/> <span>Encomendas</span></Link>
                  </li>
                  <li>
                     <Link to="/Obras" className={location.pathname === "/Obras" ? "active" : ""}><MdConstruction  size={25}/> <span>Obras</span></Link>
                  </li>
               </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
