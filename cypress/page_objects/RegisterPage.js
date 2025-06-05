class RegisterPage {
  visit() {
    cy.visit('/register');
    cy.get('#input-nome').should('be.visible');
  }

  fillField(fieldName, value) {
    const fieldSelectors = {
      'nome completo': '#input-nome',
      'senha': '#input-senha',
      'matrícula': '#input-matricula'
    };
    
    const selector = fieldSelectors[fieldName];
    if (selector && value) {
      cy.get(selector).clear().type(value);
    }
  }

  submitForm() {
    cy.get('#btn-cadastrar').should('be.enabled').click();
  }

  assertSuccessfulRegistration() {
    cy.url().should('include', '/login');
  }

  assertRegistrationError(message) {
    cy.get('.error-message').should('contain', message);
    cy.get('.error-message').should('be.visible');
  }

  assertStayOnRegisterPage() {
    cy.url().should('include', '/register');
  }

  assertSuccessMessage(message) {
    cy.get('.success-message').should('contain', message);
    cy.get('.success-message').should('be.visible');
  }

  clearAllFields() {
    cy.get('#input-nome').clear();
    cy.get('#input-senha').clear();
    cy.get('#input-matricula').clear();
  }
}

export default new RegisterPage();