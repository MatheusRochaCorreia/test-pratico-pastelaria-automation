class PastelPage {
  visit() {
    cy.visit('/pastels');
    cy.get('.pastels-container').should('be.visible');
  }

  assertPastelList(expectedPastels) {
    cy.get('.pastel-item:visible').should('have.length', expectedPastels.length);
    
    expectedPastels.forEach(pastel => {
      cy.get('.pastel-item').contains(pastel.nome).within(() => {
        if (pastel.preço) {
          cy.should('contain', `R$ ${pastel.preço}`);
        }
      });
    });
  }

  assertPastelNotVisible(pastelName) {
    cy.get('.pastel-item:visible').should('not.contain', pastelName);
  }

  assertPastelVisible(pastelName) {
    cy.get('.pastel-item:visible').should('contain', pastelName);
  }

  getPastelCount() {
    return cy.get('.pastel-item:visible');
  }

  filterActivePastels() {
    cy.get('#filter-active').check();
  }
}

export default new PastelPage();