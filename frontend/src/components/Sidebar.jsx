import "../styles/Sidebar.css";
import { Link, useLocation } from "react-router-dom";
import { IoPerson } from 'react-icons/io5';
import { FaHouse } from "react-icons/fa6";
import { BsFillPeopleFill } from "react-icons/bs";
import { MdConstruction, MdAssignment } from 'react-icons/md';
import { FaTruck, FaProjectDiagram } from 'react-icons/fa';
import { FiPackage } from "react-icons/fi";


const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    return (
        <div className={`Sidebar ${isOpen ? 'open' : ''}`}>
            <nav>
               <ul>
                  <li>
                     <Link to="/Homepage" onClick={onClose} className={location.pathname === "/Homepage" ? "active" : ""}><FaHouse size={25}/> <span>Home</span></Link>
                  </li>
                  <li>
                     <Link to="/Conta" onClick={onClose} className={location.pathname === "/Conta" ? "active" : ""}><IoPerson size={25} /> <span>Conta</span></Link>
                  </li>
                  <li>
                     <Link to="/Clientes" onClick={onClose} className={location.pathname === "/Clientes" ? "active" : ""}><BsFillPeopleFill size={25}/> <span>Clientes</span></Link>
                  </li>
                  <li>
                     <Link to="/Propostas" onClick={onClose} className={location.pathname === "/Propostas" ? "active" : ""}><MdAssignment size={25}/> <span>Propostas</span></Link>
                  </li>
                  <li>
                     <Link to="/Projetos" onClick={onClose} className={location.pathname === "/Projetos" ? "active" : ""}><FaProjectDiagram size={25}/> <span>Projetos</span></Link>
                  </li>
                  <li>
                     <Link to="/Fornecedores" onClick={onClose} className={location.pathname === "/Fornecedores" ? "active" : ""}><FaTruck size={25}/> <span>Fornecedores</span></Link>
                  </li>
                  <li>
                     <Link to="/Obras" onClick={onClose} className={location.pathname === "/Obras" ? "active" : ""}><MdConstruction  size={25}/> <span>Obras</span></Link>
                  </li>
                  <li>
                     <Link to="/Encomendas" onClick={onClose} className={location.pathname === "/Encomendas" ? "active" : ""}><FiPackage  size={25}/> <span>Encomendas</span></Link>
                  </li>
               </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
