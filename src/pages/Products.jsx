import React, { useEffect } from "react";
import { useAIAssistant } from "../contexts/AIAssistantContext";
import { useAppState } from "../contexts/AppStateContext";
import "./Products.css";

const Products = () => {
  const { updateCurrentView } = useAIAssistant();
  const { appState } = useAppState();

  // Atualiza o estado atual da visualização para o assistente
  useEffect(() => {
    updateCurrentView("products");
  }, [updateCurrentView]);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Gerenciamento de Produtos</h1>
        <p className="page-description">
          Visualize, adicione, edite e gerencie seus produtos nesta página.
        </p>
      </div>

      <div className="products-container">
        <div className="products-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="search-input"
            />
            <button className="search-button">🔍</button>
          </div>
          <button className="add-product-button">Adicionar Produto</button>
        </div>

        <div className="products-grid">
          {appState.products.length > 0 ? (
            appState.products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <div className="product-meta">
                    <span className="product-category">{product.category}</span>
                    <span className="product-stock">
                      Estoque: {product.stock}{" "}
                      {product.stock < 10 && (
                        <span className="low-stock-warning">Baixo!</span>
                      )}
                    </span>
                  </div>
                  <div className="product-price">
                    R${" "}
                    {product.price.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="product-actions">
                  <button className="edit-button">Editar</button>
                  <button className="delete-button">Excluir</button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products-message">
              Nenhum produto cadastrado. Adicione seu primeiro produto!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
