import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import PastelPage from '../page_objects/PastelPage';

Given('que existem pastéis cadastrados no sistema:', (dataTable) => {
  const pastels = dataTable.hashes().map(row => ({
    nome: row.nome,
    preco: parseFloat(row.preço),
    ativo: row.ativo === 'sim'
  }));
  
  // Mock da API de pastéis
  cy.intercept('GET', '/api/pastels?active=true', {
    statusCode: 200,
    body: pastels.filter(p => p.ativo)
  }).as('getActivePastels');
  
  cy.intercept('GET', '/api/pastels', {
    statusCode: 200,
    body: pastels
  }).as('getAllPastels');
});

When('acesso a lista de pastéis', () => {
  PastelPage.visit();
});

Then('devo ver apenas os pastéis ativos:', (dataTable) => {
  const expectedPastels = dataTable.hashes();
  cy.wait('@getActivePastels');
  PastelPage.assertPastelList(expectedPastels);
});

Then('não devo ver pastéis inativos', () => {
  cy.get('.pastel-item').each(($el) => {
    cy.wrap($el).should('not.have.class', 'inactive');
  });
});