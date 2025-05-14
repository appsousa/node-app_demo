import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppState } from "../../contexts/AppStateContext";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appState } = useAppState();
  const [collapsed, setCollapsed] = useState(false);

  // Função para verificar se um link está ativo
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Função para alternar o estado de recolhimento da sidebar
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  // Função para navegar diretamente
  const handleNavigation = (path) => {
    console.log("Navegando via Sidebar para:", path);
    navigate(path);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <button className="collapse-button" onClick={toggleCollapse}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <button
              onClick={() => handleNavigation("/")}
              className={`nav-link ${isActive("/") ? "active" : ""}`}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Dashboard</span>
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => handleNavigation("/clients")}
              className={`nav-link ${isActive("/clients") ? "active" : ""}`}
            >
              <span className="nav-icon">👥</span>
              <span className="nav-text">Clientes</span>
              {appState.clients.length > 0 && (
                <span className="nav-badge">{appState.clients.length}</span>
              )}
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => handleNavigation("/products")}
              className={`nav-link ${isActive("/products") ? "active" : ""}`}
            >
              <span className="nav-icon">📦</span>
              <span className="nav-text">Produtos</span>
              {appState.products.length > 0 && (
                <span className="nav-badge">{appState.products.length}</span>
              )}
            </button>
          </li>

          <li className="nav-item">
            <button
              onClick={() => handleNavigation("/orders")}
              className={`nav-link ${isActive("/orders") ? "active" : ""}`}
            >
              <span className="nav-icon">🛒</span>
              <span className="nav-text">Pedidos</span>
              {appState.orders.length > 0 && (
                <span className="nav-badge">{appState.orders.length}</span>
              )}
            </button>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-actions">
          <button className="sidebar-action-button settings-button">
            <span className="action-icon">⚙️</span>
            <span className="action-text">Configurações</span>
          </button>

          <button className="sidebar-action-button help-button">
            <span className="action-icon">❓</span>
            <span className="action-text">Ajuda</span>
          </button>
        </div>

        <div className="sidebar-info">
          <div className="app-version">Versão 1.0.0</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
