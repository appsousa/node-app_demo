import React, { useEffect } from "react";
import { useAIAssistant } from "../contexts/AIAssistantContext";
import { useAppState } from "../contexts/AppStateContext";
import "./Orders.css";

const Orders = () => {
  const { updateCurrentView } = useAIAssistant();
  const { appState } = useAppState();

  // Atualiza o estado atual da visualização para o assistente
  useEffect(() => {
    updateCurrentView("orders");
  }, [updateCurrentView]);

  // Função para obter o nome do cliente a partir do ID
  const getClientName = (clientId) => {
    const client = appState.clients.find((c) => c.id === clientId);
    return client ? client.name : `Cliente ${clientId}`;
  };

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Gerenciamento de Pedidos</h1>
        <p className="page-description">
          Visualize, adicione e gerencie pedidos dos seus clientes.
        </p>
      </div>

      <div className="orders-container">
        <div className="orders-actions">
          <div className="filters-container">
            <select className="filter-select">
              <option value="all">Todos os pedidos</option>
              <option value="pendente">Pendentes</option>
              <option value="aprovado">Aprovados</option>
              <option value="entregue">Entregues</option>
              <option value="cancelado">Cancelados</option>
            </select>
            <input
              type="text"
              placeholder="Buscar pedidos..."
              className="search-input"
            />
          </div>
          <button className="add-order-button">Novo Pedido</button>
        </div>

        <div className="orders-list">
          {appState.orders.length > 0 ? (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Pedido #</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {appState.orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{getClientName(order.clientId)}</td>
                    <td>{formatDate(order.date)}</td>
                    <td className="order-total">
                      R${" "}
                      {order.total.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="order-actions">
                        <button className="view-button">Ver</button>
                        <button className="status-button">Atualizar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders-message">
              Nenhum pedido registrado. Crie seu primeiro pedido!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
