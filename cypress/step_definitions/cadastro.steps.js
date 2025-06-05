import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import RegisterPage from '../page_objects/RegisterPage';

Given('que estou na página de cadastro', () => {
  RegisterPage.visit();
});

Given('o sistema está configurado com dados iniciais', () => {
  // Mock de configuração inicial
  cy.intercept('GET', '/api/config', { fixture: 'config.json' }).as('getConfig');
});

When('preencho o campo {string} com {string}', (field, value) => {
  RegisterPage.fillField(field, value);
});

When('submeto o formulário de cadastro', () => {
  // Mock da API de cadastro - sucesso
  cy.intercept('POST', '/api/users', {
    statusCode: 201,
    body: { message: 'Cadastro realizado com sucesso', id: 1 }
  }).as('createUser');
  
  RegisterPage.submitForm();
});

Then('o sistema deve registrar o usuário com sucesso', () => {
  cy.wait('@createUser').then((interception) => {
    expect(interception.response.statusCode).to.eq(201);
  });
});

Then('deve exibir mensagem de confirmação {string}', (message) => {
  RegisterPage.assertSuccessMessage(message);
});

Then('deve redirecionar para a página de login', () => {
  RegisterPage.assertSuccessfulRegistration();
});

Then('o sistema deve rejeitar o cadastro', () => {
  // Mock da API de cadastro - erro
  cy.intercept('POST', '/api/users', {
    statusCode: 400,
    body: { error: 'Dados inválidos' }
  }).as('createUserError');
});

Then('deve exibir erro {string}', (message) => {
  RegisterPage.assertRegistrationError(message);
});

Then('deve permanecer na página de cadastro', () => {
  RegisterPage.assertStayOnRegisterPage();
});