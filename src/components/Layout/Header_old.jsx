import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../../contexts/AppStateContext";
import "./Header.css";

const Header = () => {
  const { appState } = useAppState();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          Sistema de Gestão
        </Link>
      </div>

      <div className="header-right">
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar..."
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>

          <button className="notification-button">
            🔔
            {appState.notifications.length > 0 && (
              <span className="notification-badge">
                {appState.notifications.length}
              </span>
            )}
          </button>
        </div>

        <div className="user-profile">
          <div className="user-profile-button" onClick={toggleUserMenu}>
            <div className="user-avatar">
              {appState.currentUser?.name?.charAt(0) || "?"}
            </div>
            <div className="user-info">
              <div className="user-name">
                {appState.currentUser?.name || "Usuário"}
              </div>
              <div className="user-role">
                {appState.currentUser?.role || "Convidado"}
              </div>
            </div>
          </div>

          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-header">
                <div className="user-menu-name">
                  {appState.currentUser?.name || "Usuário"}
                </div>
                <div className="user-menu-email">
                  {appState.currentUser?.email || "usuario@exemplo.com"}
                </div>
              </div>

              <ul className="user-menu-items">
                <li className="user-menu-item">
                  <Link to="/profile">Meu Perfil</Link>
                </li>
                <li className="user-menu-item">
                  <Link to="/settings">Configurações</Link>
                </li>
                <li className="user-menu-item">
                  <Link to="/help">Ajuda</Link>
                </li>
                <li className="user-menu-divider"></li>
                <li className="user-menu-item">
                  <button className="logout-button">Sair</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
