import React, { useEffect } from "react";
import { useAIAssistant } from "../contexts/AIAssistantContext";
import { useAppState } from "../contexts/AppStateContext";
import ClientList from "../components/BusinessOperations/ClientList";
import "./Clients.css";

const Clients = () => {
  const { updateCurrentView } = useAIAssistant();
  const { appState } = useAppState();

  // Atualiza o estado atual da visualização para o assistente
  useEffect(() => {
    updateCurrentView && updateCurrentView("clients");

    // Log para debug
    console.log("Página de clientes carregada com estado:", appState);
  }, [updateCurrentView, appState]);

  return (
    <div className="clients-page">
      <div className="page-header">
        <h1>Gerenciamento de Clientes</h1>
        <p className="page-description">
          Visualize, adicione, edite e gerencie seus clientes nesta página.
        </p>
      </div>

      {/* Informação de debug - remova em produção */}
      <div
        style={{
          fontSize: "12px",
          margin: "10px 0",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "4px",
        }}
      >
        <p>
          <strong>Debug:</strong>{" "}
          {appState && appState.clients
            ? `${appState.clients.length} clientes no estado`
            : "Nenhum dado de cliente encontrado"}
        </p>
      </div>

      <ClientList />
    </div>
  );
};

export default Clients;
