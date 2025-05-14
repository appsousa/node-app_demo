import React, { createContext, useContext, useState, useEffect } from "react";

// Criando o contexto
const AppStateContext = createContext();

// Provider do contexto
export const AppStateProvider = ({ children }) => {
  // Estado inicial da aplicação
  const [appState, setAppState] = useState({
    // Usuário atual
    currentUser: null,

    // Informações das páginas de negócio
    clients: [],
    products: [],
    orders: [],

    // Estado de navegação
    currentPage: "home",
    previousPage: null,

    // Estado da UI
    isLoading: false,
    notifications: [],

    // Flags para controlar operações
    activeOperation: null,
    lastUpdated: null,
  });

  // Carrega os dados iniciais (simulação)
  useEffect(() => {
    // Simulando a carga inicial de dados
    const loadInitialData = async () => {
      setAppState((prev) => ({ ...prev, isLoading: true }));

      try {
        // Simulando uma chamada de API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dados simulados
        const mockData = {
          currentUser: {
            id: 1,
            name: "Usuário Demo",
            email: "usuario@exemplo.com",
            role: "admin",
          },
          clients: Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            name: `Cliente ${i + 1}`,
            email: `cliente${i + 1}@exemplo.com`,
            phone: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${
              Math.floor(Math.random() * 9000) + 1000
            }`,
            status: ["ativo", "inativo", "pendente"][
              Math.floor(Math.random() * 3)
            ],
          })),
          products: Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            name: `Produto ${i + 1}`,
            price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
            stock: Math.floor(Math.random() * 100),
            category: ["Eletrônicos", "Vestuário", "Alimentos", "Decoração"][
              Math.floor(Math.random() * 4)
            ],
          })),
          orders: Array.from({ length: 3 }, (_, i) => ({
            id: i + 1,
            clientId: Math.floor(Math.random() * 5) + 1,
            date: new Date(
              Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000
            ).toISOString(),
            items: Array.from(
              { length: Math.floor(Math.random() * 3) + 1 },
              (_, j) => ({
                productId: Math.floor(Math.random() * 8) + 1,
                quantity: Math.floor(Math.random() * 5) + 1,
              })
            ),
            status: ["pendente", "aprovado", "entregue", "cancelado"][
              Math.floor(Math.random() * 4)
            ],
            total: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
          })),
        };

        // Atualiza o estado com os dados mockados
        setAppState((prev) => ({
          ...prev,
          ...mockData,
          isLoading: false,
          lastUpdated: new Date().toISOString(),
        }));
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setAppState((prev) => ({
          ...prev,
          isLoading: false,
          notifications: [
            ...prev.notifications,
            {
              id: Date.now(),
              type: "error",
              message: "Erro ao carregar dados iniciais.",
            },
          ],
        }));
      }
    };

    loadInitialData();
  }, []);

  // Função para atualizar o estado da aplicação
  const updateAppState = (updates) => {
    setAppState((prev) => ({
      ...prev,
      ...updates,
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Função para adicionar uma notificação
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      notifications: [...prev.notifications, newNotification],
    }));

    // Remove a notificação após 5 segundos
    setTimeout(() => {
      setAppState((prev) => ({
        ...prev,
        notifications: prev.notifications.filter(
          (n) => n.id !== newNotification.id
        ),
      }));
    }, 5000);
  };

  // Função para mudar a página atual
  const changePage = (pageName) => {
    setAppState((prev) => ({
      ...prev,
      previousPage: prev.currentPage,
      currentPage: pageName,
    }));
  };

  // Funções CRUD para clientes
  const addClient = (client) => {
    const newClient = {
      id: appState.clients.length + 1,
      ...client,
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
      lastUpdated: new Date().toISOString(),
    }));

    return newClient;
  };

  const updateClient = (clientId, updates) => {
    setAppState((prev) => ({
      ...prev,
      clients: prev.clients.map((client) =>
        client.id === clientId
          ? { ...client, ...updates, updatedAt: new Date().toISOString() }
          : client
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteClient = (clientId) => {
    setAppState((prev) => ({
      ...prev,
      clients: prev.clients.filter((client) => client.id !== clientId),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Funções CRUD para produtos
  const addProduct = (product) => {
    const newProduct = {
      id: appState.products.length + 1,
      ...product,
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
      lastUpdated: new Date().toISOString(),
    }));

    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setAppState((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === productId
          ? { ...product, ...updates, updatedAt: new Date().toISOString() }
          : product
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  const deleteProduct = (productId) => {
    setAppState((prev) => ({
      ...prev,
      products: prev.products.filter((product) => product.id !== productId),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Funções CRUD para pedidos
  const addOrder = (order) => {
    const newOrder = {
      id: appState.orders.length + 1,
      ...order,
      date: new Date().toISOString(),
      status: order.status || "pendente",
    };

    setAppState((prev) => ({
      ...prev,
      orders: [...prev.orders, newOrder],
      lastUpdated: new Date().toISOString(),
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId, status) => {
    setAppState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      ),
      lastUpdated: new Date().toISOString(),
    }));
  };

  // Valores expostos pelo contexto
  const contextValue = {
    appState,
    updateAppState,
    addNotification,
    changePage,
    addClient,
    updateClient,
    deleteClient,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

// Custom hook para usar o contexto
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState deve ser usado dentro de um AppStateProvider");
  }
  return context;
};
