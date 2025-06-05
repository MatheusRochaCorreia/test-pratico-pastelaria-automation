class AccountPage {
  visit() {
    cy.visit('/account');
    cy.get('.account-container').should('be.visible');
  }

  closeAccount() {
    cy.get('#btn-fechar-conta').should('be.visible').click();
    cy.get('.processing-indicator').should('not.exist');
  }

  assertItemDetails() {
    cy.get('.item-list').should('be.visible');
    cy.get('.item-row').should('have.length.greaterThan', 0);
  }

  assertTotal(expectedTotal) {
    cy.get('.total-value').should('contain', expectedTotal);
  }

  getAccountDetails() {
    return cy.get('.account-details');
  }
}

export default new AccountPage();
