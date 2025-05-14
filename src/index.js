import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

// Detecta se estamos usando React 18+ verificando se "createRoot" existe
const rootElement = document.getElementById("root");

// Tenta detectar a versão do React
const isReact18OrNewer = ReactDOM.createRoot !== undefined;

// Se for React 18+, usa o novo método createRoot
if (isReact18OrNewer && rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("Renderizado com React 18+ createRoot");
  } catch (err) {
    console.error("Erro com createRoot, usando método tradicional:", err);

    // Fallback para React 17 em caso de erro
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      rootElement
    );
  }
} else if (rootElement) {
  // Se for React 17 ou anterior, usa o método render tradicional
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    rootElement
  );
  console.log("Renderizado com React 17 render");
} else {
  console.error("Elemento root não encontrado");
}
