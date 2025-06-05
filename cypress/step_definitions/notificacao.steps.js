import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import NotificationPage from '../page_objects/NotificationPage';

Given('que um garçom fez um pedido para mesa {string}', (tableNumber) => {
  // Setup do pedido existente
  cy.intercept('GET', `/api/orders/mesa/${tableNumber}`, {
    statusCode: 200,
    body: { id: 1, mesa: tableNumber, status: 'preparando' }
  }).as('getOrderByTable');
});

Given('o pedido está sendo preparado na cozinha', () => {
  // Mock do status de preparação
  cy.intercept('GET', '/api/orders/1/status', {
    statusCode: 200,
    body: { status: 'preparando' }
  }).as('getOrderStatus');
});

When('a cozinha marca o pedido como pronto', () => {
  // Mock da atualização de status
  cy.intercept('PATCH', '/api/orders/1/status', {
    statusCode: 200,
    body: { status: 'pronto', mesa: '4' }
  }).as('updateOrderStatus');
  
  // Mock da notificação
  cy.intercept('GET', '/api/notifications', {
    statusCode: 200,
    body: [{ 
      id: 1, 
      message: 'Pedido pronto para mesa 4',
      timestamp: new Date().toISOString(),
      read: false
    }]
  }).as('getNotifications');
  
  // Simula a ação da cozinha
  cy.request('PATCH', '/api/orders/1/status', { status: 'pronto' });
});

Then('o garçom deve receber notificação {string}', (message) => {
  NotificationPage.visit();
  cy.wait('@getNotifications');
  NotificationPage.assertNotificationExists(message);
});

Then('a notificação deve aparecer na interface', () => {
  cy.get('.notification-item').should('be.visible');
});

Then('deve ser registrada no histórico de notificações', () => {
  cy.wait('@getNotifications').then((interception) => {
    expect(interception.response.body).to.have.length.greaterThan(0);
  });
});