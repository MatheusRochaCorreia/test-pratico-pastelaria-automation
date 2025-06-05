import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PastelPage from '../page_objects/PastelPage';

Given('que existe um pastel {string} ativo no sistema', (pastelName) => {
  cy.intercept('GET', '/api/pastels?active=true', {
    statusCode: 200,
    body: [{ nome: pastelName, preco: 5.00, ativo: true }]
  }).as('getPastelsWithQueijo');
});

Given('o ingrediente {string} está disponível', (ingredient) => {
  cy.intercept('GET', `/api/ingredients/${ingredient}`, {
    statusCode: 200,
    body: { nome: ingredient, disponivel: true }
  }).as('getIngredient');
});

When('a cozinha marca o ingrediente {string} como esgotado', (ingredient) => {
  // Mock da atualização do ingrediente
  cy.intercept('PATCH', `/api/ingredients/${ingredient}`, {
    statusCode: 200,
    body: { nome: ingredient, disponivel: false }
  }).as('updateIngredient');
  
  // Mock da nova lista sem o pastel que usa esse ingrediente
  cy.intercept('GET', '/api/pastels?active=true', {
    statusCode: 200,
    body: [] // Lista vazia pois o queijo não está disponível
  }).as('getPastelsWithoutQueijo');
  
  // Simula a ação da cozinha
  cy.request('PATCH', `/api/ingredients/${ingredient}`, { disponivel: false });
});

Then('o {string} não deve aparecer na lista de pastéis', (pastelName) => {
  PastelPage.visit();
  cy.wait('@getPastelsWithoutQueijo');
  PastelPage.assertPastelNotVisible(pastelName);
});

Then('a API deve retornar status {int} para a atualização', (statusCode) => {
  cy.wait('@updateIngredient').then((interception) => {
    expect(interception.response.statusCode).to.eq(statusCode);
  });
});
