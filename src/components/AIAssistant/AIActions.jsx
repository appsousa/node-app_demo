import React, { useEffect, useState } from "react";
import "./AIActions.css";

const AIActions = ({ action }) => {
  const [status, setStatus] = useState("executing");
  const [progress, setProgress] = useState(0);

  // Simula o progresso da ação sendo executada
  useEffect(() => {
    if (!action) return;

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setStatus("completed");
          return 100;
        }
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  }, [action]);

  if (!action) return null;

  return (
    <div className="ai-actions-container">
      <div className="action-card">
        <div className="action-header">
          <h4>{action.type} em andamento</h4>
          <span className={`status-badge ${status}`}>
            {status === "executing" ? "Executando..." : "Concluído"}
          </span>
        </div>

        <div className="action-details">
          <p>
            <strong>Descrição:</strong> {action.description}
          </p>
          {action.targetScreen && (
            <p>
              <strong>Tela Alvo:</strong> {action.targetScreen}
            </p>
          )}
        </div>

        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-text">{progress}%</span>
        </div>
      </div>
    </div>
  );
};

export default AIActions;
