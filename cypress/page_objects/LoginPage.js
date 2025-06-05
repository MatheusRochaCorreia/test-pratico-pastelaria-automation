class LoginPage {
  visit() {
    cy.visit('/login');
    cy.get('#input-nome').should('be.visible');
  }

  fillCredentials(name, password) {
    cy.get('#input-nome').clear().type(name);
    cy.get('#input-senha').clear().type(password);
  }

  submit() {
    cy.get('#btn-entrar').should('be.enabled').click();
  }

  assertSuccessfulLogin() {
    cy.url().should('include', '/dashboard');
    cy.get('.user-welcome').should('be.visible');
  }

  assertLoginError(message) {
    cy.get('.error-message').should('contain', message);
    cy.get('.error-message').should('be.visible');
  }

  assertStayOnLoginPage() {
    cy.url().should('include', '/login');
  }

  verifyTokenSaved() {
    cy.window().then((win) => {
      expect(win.localStorage.getItem('authToken')).to.not.be.null;
    });
  }
}

export default new LoginPage();