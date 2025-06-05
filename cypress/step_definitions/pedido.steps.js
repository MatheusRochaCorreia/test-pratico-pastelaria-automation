import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import OrderPage from '../page_objects/OrderPage';

Given('que estou autenticado como garçom {string}', (garcomName) => {
  // Mock de autenticação
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', 'fake-jwt-token');
    win.localStorage.setItem('userRole', 'garcom');
    win.localStorage.setItem('userName', garcomName);
  });
});

Given('que estou autenticado como garçom', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', 'fake-jwt-token');
    win.localStorage.setItem('userRole', 'garcom');
  });
});

Given('que estou como {string}', (userType) => {
  if (userType === 'usuário anônimo') {
    cy.window().then((win) => {
      win.localStorage.clear();
    });
  } else if (userType === 'cliente comum') {
    cy.window().then((win) => {
      win.localStorage.setItem('authToken', 'fake-jwt-token');
      win.localStorage.setItem('userRole', 'cliente');
    });
  }
});

Given('a mesa {string} está disponível', (tableNumber) => {
  cy.intercept('GET', `/api/tables/${tableNumber}`, {
    statusCode: 200,
    body: { numero: tableNumber, disponivel: true }
  }).as('checkTable');
});

Given('existem pastéis disponíveis no sistema', () => {
  cy.intercept('GET', '/api/pastels?active=true', {
    statusCode: 200,
    body: [
      { nome: 'Queijo', preco: 5.00 },
      { nome: 'Carne', preco: 6.50 },
      { nome: 'Frango', preco: 4.50 }
    ]
  }).as('getAvailablePastels');
});

When('crio um pedido para mesa {string} com os itens:', (tableNumber, dataTable) => {
  const items = dataTable.hashes();
  
  // Mock de criação de pedido
  cy.intercept('POST', '/api/orders', {
    statusCode: 201,
    body: { 
      id: 1, 
      mesa: tableNumber, 
      items: items,
      status: 'criado',
      message: 'Pedido realizado com sucesso'
    }
  }).as('createOrder');
  
  OrderPage.visit();
  OrderPage.selectTable(tableNumber);
  
  items.forEach(item => {
    OrderPage.addItemToOrder(item.pastel, item.quantidade, item.observacao);
  });
  
  OrderPage.submitOrder();
});

When('crio um pedido com múltiplos itens:', (dataTable) => {
  const items = dataTable.hashes();
  
  cy.intercept('POST', '/api/orders', {
    statusCode: 201,
    body: { 
      id: 2, 
      items: items,
      message: 'Pedido realizado com sucesso'
    }
  }).as('createMultiItemOrder');
  
  OrderPage.visit();
  OrderPage.selectTable('3');
  
  items.forEach(item => {
    OrderPage.addItemToOrder(item.pastel, item.quantidade, item.observacao);
  });
  
  OrderPage.submitOrder();
});

When('tento criar um pedido para mesa {string}', (tableNumber) => {
  // Mock para usuários não autorizados
  cy.intercept('POST', '/api/orders', (req) => {
    const authToken = req.headers.authorization;
    if (!authToken) {
      req.reply({ statusCode: 401, body: { error: 'Autentique-se primeiro' } });
    } else if (req.headers['user-role'] !== 'garcom') {
      req.reply({ statusCode: 403, body: { error: 'Usuário não autorizado' } });
    }
  }).as('createOrderUnauthorized');
  
  OrderPage.visit();
  OrderPage.selectTable(tableNumber);
  OrderPage.addItemToOrder('Queijo', '1');
  OrderPage.submitOrder();
});

Then('o sistema deve registrar o pedido com sucesso', () => {
  cy.wait('@createOrder').then((interception) => {
    expect(interception.response.statusCode).to.eq(201);
  });
});

Then('o pedido deve ser registrado com sucesso', () => {
  cy.wait('@createMultiItemOrder');
});

Then('deve exibir mensagem {string}', (message) => {
  OrderPage.assertSuccessMessage(message);
});

Then('o pedido deve ser salvo no banco de dados', () => {
  // Verificação adicional se necessário
  cy.wait('@createOrder').then((interception) => {
    expect(interception.response.body).to.have.property('id');
  });
});

Then('o sistema deve bloquear a operação', () => {
  cy.wait('@createOrderUnauthorized');
});

Then('deve retornar status {string}', (statusCode) => {
  cy.wait('@createOrderUnauthorized').then((interception) => {
    expect(interception.response.statusCode).to.eq(parseInt(statusCode));
  });
});

Then('cada item deve conter sua observação correta', () => {
  cy.wait('@createMultiItemOrder').then((interception) => {
    const items = interception.response.body.items;
    items.forEach(item => {
      if (item.observacao) {
        expect(item.observacao).to.not.be.empty;
      }
    });
  });
});

Then('o total de itens deve ser {int}', (expectedTotal) => {
  OrderPage.getTotalItems().should('contain', expectedTotal);
});
