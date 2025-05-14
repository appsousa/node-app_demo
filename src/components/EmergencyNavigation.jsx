import React from "react";
import { useNavigate } from "react-router-dom";

// Estilo inline para garantir que não haja conflitos com outros estilos
const styles = {
  container: {
    backgroundColor: "#ffeb3b",
    padding: "10px",
    margin: "0 0 15px 0",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    textAlign: "center",
    zIndex: 1000,
  },
  heading: {
    margin: "0 0 10px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  button: {
    backgroundColor: "#333",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "14px",
  },
};

const EmergencyNavigation = () => {
  // Usamos window.location para navegação direta, como último recurso
  const handleDirectNavigation = (path) => {
    console.log("Navegação de emergência para:", path);
    window.location.href = path;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Navegação de Emergência</h2>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onClick={() => handleDirectNavigation("/")}
        >
          Página Inicial
        </button>
        <button
          style={styles.button}
          onClick={() => handleDirectNavigation("/clients")}
        >
          Clientes
        </button>
        <button
          style={styles.button}
          onClick={() => handleDirectNavigation("/products")}
        >
          Produtos
        </button>
        <button
          style={styles.button}
          onClick={() => handleDirectNavigation("/orders")}
        >
          Pedidos
        </button>
      </div>
    </div>
  );
};

export default EmergencyNavigation;
