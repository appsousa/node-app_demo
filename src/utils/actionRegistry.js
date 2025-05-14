/**
 * Registro de ações que o assistente pode executar no sistema
 *
 * Este módulo contém as definições de ações disponíveis para o assistente,
 * as funções para extrair ações de uma mensagem, e funções auxiliares
 * para validar e processar ações.
 */

// Definição das ações disponíveis para o assistente
export const AVAILABLE_ACTIONS = {
  // Ações de navegação
  NAVIGATE: {
    type: "navigation",
    description: "Navegar para uma tela específica do sistema",
    parameters: {
      target: {
        type: "string",
        description: "Nome da tela de destino",
        required: true,
        enum: ["home", "clients", "products", "orders"],
      },
    },
  },

  // Ações CRUD - Criar
  CREATE_CLIENT: {
    type: "create",
    entity: "client",
    description: "Criar um novo registro de cliente",
    parameters: {
      formData: {
        type: "object",
        description: "Dados para criação do cliente",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          status: { type: "string", enum: ["ativo", "inativo", "pendente"] },
        },
      },
    },
  },

  CREATE_PRODUCT: {
    type: "create",
    entity: "product",
    description: "Criar um novo registro de produto",
    parameters: {
      formData: {
        type: "object",
        description: "Dados para criação do produto",
        properties: {
          name: { type: "string" },
          price: { type: "number" },
          stock: { type: "number" },
          category: { type: "string" },
        },
      },
    },
  },

  CREATE_ORDER: {
    type: "create",
    entity: "order",
    description: "Criar um novo pedido",
    parameters: {
      formData: {
        type: "object",
        description: "Dados para criação do pedido",
        properties: {
          clientId: { type: "number" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "number" },
                quantity: { type: "number" },
              },
            },
          },
          status: {
            type: "string",
            enum: ["pendente", "aprovado", "entregue", "cancelado"],
          },
        },
      },
    },
  },

  // Ações CRUD - Listar
  LIST_CLIENTS: {
    type: "list",
    entity: "clients",
    description: "Listar todos os clientes cadastrados",
  },

  LIST_PRODUCTS: {
    type: "list",
    entity: "products",
    description: "Listar todos os produtos cadastrados",
  },

  LIST_ORDERS: {
    type: "list",
    entity: "orders",
    description: "Listar todos os pedidos cadastrados",
  },

  // Ações CRUD - Atualizar Status de Pedido
  UPDATE_ORDER_STATUS: {
    type: "update",
    entity: "order",
    operation: "status",
    description: "Atualizar o status de um pedido",
    parameters: {
      orderId: { type: "number", description: "ID do pedido", required: true },
      status: {
        type: "string",
        description: "Novo status",
        required: true,
        enum: ["pendente", "aprovado", "entregue", "cancelado"],
      },
    },
  },

  // Ações CRUD - Busca
  SEARCH_CLIENTS: {
    type: "search",
    entity: "clients",
    description: "Buscar clientes por termo de pesquisa",
    parameters: {
      query: {
        type: "string",
        description: "Termo de pesquisa",
        required: true,
      },
    },
  },

  SEARCH_PRODUCTS: {
    type: "search",
    entity: "products",
    description: "Buscar produtos por termo de pesquisa",
    parameters: {
      query: {
        type: "string",
        description: "Termo de pesquisa",
        required: true,
      },
    },
  },

  SEARCH_ORDERS: {
    type: "search",
    entity: "orders",
    description: "Buscar pedidos por termo de pesquisa",
    parameters: {
      query: {
        type: "string",
        description: "Termo de pesquisa",
        required: true,
      },
    },
  },
};

/**
 * Extrai ações a partir do texto gerado pelo LLM
 * @param {string} text - Texto gerado pelo LLM
 * @returns {Array} - Lista de ações extraídas
 */
export const extractActionsFromText = (text) => {
  const actions = [];

  // Para a POC, esta é uma implementação simplificada que busca palavras-chave
  // Em produção, isso usaria processamento de linguagem natural mais sofisticado
  // ou Expresssões Regulares para identificar ações

  // Navegar para telas
  if (text.match(/navegar|ir|abrir|exibir|mostrar/i)) {
    if (text.match(/cliente|clientes/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.NAVIGATE,
        parameters: { target: "clients" },
      });
    } else if (text.match(/produto|produtos/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.NAVIGATE,
        parameters: { target: "products" },
      });
    } else if (text.match(/pedido|pedidos/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.NAVIGATE,
        parameters: { target: "orders" },
      });
    } else if (text.match(/home|inicial|principal/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.NAVIGATE,
        parameters: { target: "home" },
      });
    }
  }

  // Criar registros
  if (text.match(/criar|novo|nova|cadastrar|adicionar/i)) {
    if (text.match(/cliente/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.CREATE_CLIENT,
      });
    } else if (text.match(/produto/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.CREATE_PRODUCT,
      });
    } else if (text.match(/pedido/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.CREATE_ORDER,
      });
    }
  }

  // Listar registros
  if (text.match(/listar|todos|todas|exibir|mostrar/i)) {
    if (text.match(/cliente|clientes/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.LIST_CLIENTS,
      });
    } else if (text.match(/produto|produtos/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.LIST_PRODUCTS,
      });
    } else if (text.match(/pedido|pedidos/i)) {
      actions.push({
        ...AVAILABLE_ACTIONS.LIST_ORDERS,
      });
    }
  }

  return actions;
};

/**
 * Valida se uma ação é válida e completa
 * @param {Object} action - Ação a ser validada
 * @returns {Object} - Resultado da validação
 */
export const validateAction = (action) => {
  // Verifica se o tipo de ação existe
  if (!action.type) {
    return {
      valid: false,
      error: "Tipo de ação não especificado",
    };
  }

  // Encontra a definição da ação
  const actionDefinition = Object.values(AVAILABLE_ACTIONS).find(
    (a) =>
      a.type === action.type && (a.entity === action.entity || !action.entity)
  );

  if (!actionDefinition) {
    return {
      valid: false,
      error: `Ação desconhecida: ${action.type}${
        action.entity ? " para entidade " + action.entity : ""
      }`,
    };
  }

  // Verifica parâmetros obrigatórios
  if (actionDefinition.parameters) {
    for (const [paramName, paramDef] of Object.entries(
      actionDefinition.parameters
    )) {
      if (paramDef.required && !action.parameters?.[paramName]) {
        return {
          valid: false,
          error: `Parâmetro obrigatório ausente: ${paramName}`,
        };
      }
    }
  }

  return { valid: true };
};

/**
 * Formata uma ação para ser exibida em logs ou depuração
 * @param {Object} action - Ação a formatar
 * @returns {string} - Representação legível da ação
 */
export const formatActionForDisplay = (action) => {
  let result = `Ação: ${action.type}`;

  if (action.entity) {
    result += ` | Entidade: ${action.entity}`;
  }

  if (action.parameters) {
    result += ` | Parâmetros: ${JSON.stringify(action.parameters)}`;
  }

  return result;
};
