import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../page_objects/LoginPage';

Given('que existe um usuário cadastrado com nome {string} e senha {string}', (name, password) => {
  // Mock de usuário existente no sistema
  cy.intercept('POST', '/api/auth', (req) => {
    if (req.body.nome === name && req.body.senha === password) {
      req.reply({
        statusCode: 200,
        body: { 
          token: 'fake-jwt-token-123',
          user: { nome: name, role: 'garcom' }
        }
      });
    } else {
      req.reply({
        statusCode: 401,
        body: { error: 'Credenciais inválidas' }
      });
    }
  }).as('loginAttempt');
});

When('faço login com nome {string} e senha {string}', (name, password) => {
  LoginPage.visit();
  LoginPage.fillCredentials(name, password);
  LoginPage.submit();
});

When('tento fazer login com nome {string} e senha {string}', (name, password) => {
  // Mock para credenciais inválidas
  cy.intercept('POST', '/api/auth', {
    statusCode: 401,
    body: { error: 'Credenciais inválidas' }
  }).as('loginError');
  
  LoginPage.visit();
  LoginPage.fillCredentials(name, password);
  LoginPage.submit();
});

Then('devo ser autenticado com sucesso', () => {
  cy.wait('@loginAttempt');
  LoginPage.assertSuccessfulLogin();
});

Then('devo ser redirecionado para o dashboard', () => {
  cy.url().should('include', '/dashboard');
});

Then('o token JWT deve ser salvo no localStorage', () => {
  LoginPage.verifyTokenSaved();
});

Then('devo receber erro {string}', (message) => {
  LoginPage.assertLoginError(message);
});

Then('devo permanecer na página de login', () => {
  LoginPage.assertStayOnLoginPage();
});

Then('o sistema deve retornar status {int}', (statusCode) => {
  cy.wait('@loginError').then((interception) => {
    expect(interception.response.statusCode).to.eq(statusCode);
  });
});
