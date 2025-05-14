import React, { useState, useEffect } from "react";
import { useAppState } from "../../contexts/AppStateContext";
import { useAIAssistant } from "../../contexts/AIAssistantContext";
import "./ClientList.css";

const ClientList = () => {
  const { appState, addClient, updateClient, deleteClient, addNotification } =
    useAppState();
  const { updateCurrentView } = useAIAssistant();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    status: "ativo",
  });

  // Atualiza o estado atual da visualização para o assistente
  useEffect(() => {
    updateCurrentView && updateCurrentView("clients");

    // Verifica se existe uma operação ativa iniciada pelo assistente
    if (
      appState.activeOperation &&
      appState.activeOperation.type === "create" &&
      appState.activeOperation.entityType === "client"
    ) {
      setIsAddingClient(true);
    }

    // Log para debug
    console.log("Estado da aplicação na página de clientes:", appState);
  }, [updateCurrentView, appState.activeOperation]);

  // Função para filtrar clientes com base no termo de pesquisa
  const filteredClients = appState.clients
    ? appState.clients.filter((client) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          client.name.toLowerCase().includes(searchTermLower) ||
          client.email.toLowerCase().includes(searchTermLower) ||
          client.phone.includes(searchTerm)
        );
      })
    : [];

  // Manipuladores de eventos para o formulário de novo cliente
  const handleNewClientChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddClient = () => {
    // Validação básica
    if (!newClient.name || !newClient.email) {
      addNotification &&
        addNotification({
          type: "error",
          message:
            "Por favor, preencha pelo menos o nome e o email do cliente.",
        });
      return;
    }

    try {
      // Adiciona o cliente
      const client = addClient
        ? addClient(newClient)
        : {
            id: appState.clients ? appState.clients.length + 1 : 1,
            ...newClient,
            createdAt: new Date().toISOString(),
          };

      // Se não temos a função addClient do contexto, adicionamos manualmente
      if (!addClient) {
        if (!appState.clients) {
          appState.clients = [];
        }
        appState.clients.push(client);
      }

      // Exibe notificação de sucesso
      addNotification &&
        addNotification({
          type: "success",
          message: `Cliente ${client.name} adicionado com sucesso!`,
        });

      // Limpa o formulário e fecha o modo de adição
      setNewClient({
        name: "",
        email: "",
        phone: "",
        status: "ativo",
      });
      setIsAddingClient(false);
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error);
      addNotification &&
        addNotification({
          type: "error",
          message: "Erro ao adicionar cliente. Tente novamente.",
        });
    }
  };

  const handleCancelAdd = () => {
    setNewClient({
      name: "",
      email: "",
      phone: "",
      status: "ativo",
    });
    setIsAddingClient(false);
  };

  // Renderização do componente
  return (
    <div className="client-list-container">
      <div className="client-list-header">
        <h2>Clientes</h2>
        <div className="client-list-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
              >
                &times;
              </button>
            )}
          </div>
          <button
            className="add-client-button"
            onClick={() => setIsAddingClient(true)}
          >
            Adicionar Cliente
          </button>
        </div>
      </div>

      {/* Debug info - remova em produção */}
      <div
        style={{
          fontSize: "12px",
          margin: "10px 0",
          padding: "5px",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p>
          Status:{" "}
          {appState.clients
            ? `${appState.clients.length} clientes encontrados`
            : "Nenhum cliente no estado"}
        </p>
      </div>

      {/* Formulário para adicionar novo cliente */}
      {isAddingClient && (
        <div className="add-client-form">
          <h3>Novo Cliente</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newClient.name}
                onChange={handleNewClientChange}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newClient.email}
                onChange={handleNewClientChange}
                placeholder="Email do cliente"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Telefone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={newClient.phone}
                onChange={handleNewClientChange}
                placeholder="Telefone do cliente"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={newClient.status}
                onChange={handleNewClientChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button className="cancel-button" onClick={handleCancelAdd}>
              Cancelar
            </button>
            <button className="save-button" onClick={handleAddClient}>
              Salvar Cliente
            </button>
          </div>
        </div>
      )}

      {/* Lista de clientes */}
      <div className="clients-table-container">
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients && filteredClients.length > 0 ? (
              filteredClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>
                    <span className={`status-badge ${client.status}`}>
                      {client.status.charAt(0).toUpperCase() +
                        client.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="action-button status-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newStatus =
                            client.status === "ativo" ? "inativo" : "ativo";
                          updateClient &&
                            updateClient(client.id, { status: newStatus });
                        }}
                      >
                        {client.status === "ativo" ? "Desativar" : "Ativar"}
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Tem certeza que deseja excluir este cliente?"
                            )
                          ) {
                            deleteClient && deleteClient(client.id);
                            addNotification &&
                              addNotification({
                                type: "success",
                                message: "Cliente excluído com sucesso!",
                              });
                          }
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-clients-message">
                  {searchTerm
                    ? "Nenhum cliente encontrado com este termo de busca."
                    : "Nenhum cliente cadastrado. Adicione seu primeiro cliente!"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;
