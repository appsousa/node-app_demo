import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppState } from "../contexts/AppStateContext";
import { useAIAssistant } from "../contexts/AIAssistantContext";
import "./Home.css";

const Home = () => {
  const { appState } = useAppState();
  const { updateCurrentView } = useAIAssistant();

  // Atualiza o estado atual da visualização para o assistente
  useEffect(() => {
    updateCurrentView("home");
  }, [updateCurrentView]);

  // Calcular estatísticas para o dashboard
  const totalClients = appState.clients.length;
  const activeClients = appState.clients.filter(
    (client) => client.status === "ativo"
  ).length;

  const totalProducts = appState.products.length;
  const lowStockProducts = appState.products.filter(
    (product) => product.stock < 10
  ).length;

  const totalOrders = appState.orders.length;
  const pendingOrders = appState.orders.filter(
    (order) => order.status === "pendente"
  ).length;
  const deliveredOrders = appState.orders.filter(
    (order) => order.status === "entregue"
  ).length;

  // Calcular total de vendas
  const totalSales = appState.orders
    .filter((order) => order.status !== "cancelado")
    .reduce((sum, order) => sum + order.total, 0);

  // Encontrar os produtos mais vendidos
  const productSales = {};
  appState.orders.forEach((order) => {
    order.items.forEach((item) => {
      if (productSales[item.productId]) {
        productSales[item.productId] += item.quantity;
      } else {
        productSales[item.productId] = item.quantity;
      }
    });
  });

  // Converter para array e ordenar
  const topProducts = Object.entries(productSales)
    .map(([productId, quantity]) => {
      const product = appState.products.find(
        (p) => p.id === parseInt(productId)
      );
      return {
        id: parseInt(productId),
        name: product ? product.name : `Produto ${productId}`,
        quantity,
      };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 3);

  // Encontrar os pedidos mais recentes
  const recentOrders = [...appState.orders]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Bem-vindo ao Sistema de Gestão</h1>
        <p className="subtitle">
          Controle seus clientes, produtos e pedidos em um só lugar.
        </p>
      </div>

      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-header">
            <h3>Clientes</h3>
            <span className="stat-icon clients-icon">👥</span>
          </div>
          <div className="stat-body">
            <div className="stat-number">{totalClients}</div>
            <div className="stat-label">Total de Clientes</div>
          </div>
          <div className="stat-footer">
            <div className="stat-detail">
              <span className="active-dot"></span>
              {activeClients} Ativos
            </div>
            <Link to="/clients" className="stat-action">
              Ver todos
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Produtos</h3>
            <span className="stat-icon products-icon">📦</span>
          </div>
          <div className="stat-body">
            <div className="stat-number">{totalProducts}</div>
            <div className="stat-label">Total de Produtos</div>
          </div>
          <div className="stat-footer">
            <div className="stat-detail">
              <span className="warning-dot"></span>
              {lowStockProducts} Com estoque baixo
            </div>
            <Link to="/products" className="stat-action">
              Ver todos
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Pedidos</h3>
            <span className="stat-icon orders-icon">🛒</span>
          </div>
          <div className="stat-body">
            <div className="stat-number">{totalOrders}</div>
            <div className="stat-label">Total de Pedidos</div>
          </div>
          <div className="stat-footer">
            <div className="stat-detail">
              <span className="pending-dot"></span>
              {pendingOrders} Pendentes
            </div>
            <Link to="/orders" className="stat-action">
              Ver todos
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <h3>Vendas</h3>
            <span className="stat-icon sales-icon">💰</span>
          </div>
          <div className="stat-body">
            <div className="stat-number">
              R${" "}
              {totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="stat-label">Total de Vendas</div>
          </div>
          <div className="stat-footer">
            <div className="stat-detail">
              <span className="success-dot"></span>
              {deliveredOrders} Pedidos entregues
            </div>
            <Link to="/orders" className="stat-action">
              Ver detalhes
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Produtos Mais Vendidos</h3>
            <Link to="/products" className="view-all">
              Ver todos
            </Link>
          </div>
          <div className="card-content">
            {topProducts.length > 0 ? (
              <ul className="top-products-list">
                {topProducts.map((product, index) => (
                  <li key={product.id} className="top-product-item">
                    <div className="product-rank">{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-quantity">
                        {product.quantity} unidades vendidas
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-data-message">
                Nenhuma venda registrada ainda.
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Pedidos Recentes</h3>
            <Link to="/orders" className="view-all">
              Ver todos
            </Link>
          </div>
          <div className="card-content">
            {recentOrders.length > 0 ? (
              <ul className="recent-orders-list">
                {recentOrders.map((order) => {
                  const client = appState.clients.find(
                    (c) => c.id === order.clientId
                  );
                  return (
                    <li key={order.id} className="recent-order-item">
                      <div className="order-info">
                        <div className="order-title">
                          Pedido #{order.id}
                          <span
                            className={`order-status-badge ${order.status}`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                        <div className="order-details">
                          <span className="order-client">
                            {client ? client.name : `Cliente ${order.clientId}`}
                          </span>
                          <span className="order-date">
                            {new Date(order.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                      <div className="order-amount">
                        R${" "}
                        {order.total.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="no-data-message">
                Nenhum pedido realizado ainda.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Ações Rápidas</h3>
        <div className="actions-buttons">
          <Link to="/clients/new" className="action-button">
            <span className="action-icon">👤</span>
            Novo Cliente
          </Link>
          <Link to="/products/new" className="action-button">
            <span className="action-icon">📦</span>
            Novo Produto
          </Link>
          <Link to="/orders/new" className="action-button">
            <span className="action-icon">🛒</span>
            Novo Pedido
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
