import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AccountPage from '../page_objects/AccountPage';

Given('que a mesa {string} possui os seguintes pedidos:', (tableNumber, dataTable) => {
  const orders = dataTable.hashes();
  const total = orders.reduce((sum, order) => {
    return sum + (parseFloat(order.preço_unitario) * parseInt(order.quantidade));
  }, 0);
  
  // Mock dos pedidos da mesa
  cy.intercept('GET', `/api/orders/mesa/${tableNumber}`, {
    statusCode: 200,
    body: {
      mesa: tableNumber,
      pedidos: orders,
      total: total.toFixed(2)
    }
  }).as('getTableOrders');
});

Given('que a mesa {string} possui pedidos com valores:', (tableNumber, dataTable) => {
  const items = dataTable.hashes();
  const total = items.reduce((sum, item) => sum + parseFloat(item.valor), 0);
  
  cy.intercept('GET', `/api/orders/mesa/${tableNumber}`, {
    statusCode: 200,
    body: {
      mesa: tableNumber,
      items: items,
      total: total.toFixed(2)
    }
  }).as('getTableOrdersWithValues');
});

When('solicito o fechamento da conta', () => {
  AccountPage.visit();
  AccountPage.closeAccount();
});

When('calculo o total da conta', () => {
  AccountPage.visit();
});

Then('o sistema deve calcular o total {string}', (expectedTotal) => {
  const cleanTotal = expectedTotal.replace('R$ ', '');
  cy.wait('@getTableOrders');
  AccountPage.assertTotal(cleanTotal);
});

Then('o valor total deve ser {string}', (expectedTotal) => {
  const cleanTotal = expectedTotal.replace('R$ ', '');
  cy.wait('@getTableOrdersWithValues');
  AccountPage.assertTotal(cleanTotal);
});

Then('deve exibir o detalhamento dos itens', () => {
  AccountPage.assertItemDetails();
});

Then('deve permitir finalizar a conta', () => {
  cy.get('#btn-finalizar-conta').should('be.visible').and('be.enabled');
});

Then('a formatação deve estar correta', () => {
  cy.get('.total-value').should('match', /R\$ \d+,\d{2}/);
});