class OrderPage {
  visit() {
    cy.visit('/order');
    cy.get('#mesa-select').should('be.visible');
  }

  selectTable(tableNumber) {
    cy.get('#mesa-select').select(tableNumber.toString());
  }

  addItemToOrder(pastelName, quantity, observation = '') {
    cy.get('.pastels-list').contains('.item-card', pastelName).within(() => {
      cy.get('.qty-input').clear().type(quantity.toString());
      if (observation) {
        cy.get('.obs-input').clear().type(observation);
      }
      cy.get('.btn-add').click();
    });
  }

  submitOrder() {
    cy.get('#btn-confirm').should('be.enabled').click();
  }

  assertSuccessMessage(message) {
    cy.get('.success-message').should('contain', message);
    cy.get('.success-message').should('be.visible');
  }

  assertErrorMessage(message) {
    cy.get('.error-message').should('contain', message);
    cy.get('.error-message').should('be.visible');
  }

  assertOrderSummary(expectedItems) {
    cy.get('.order-summary').should('be.visible');
    expectedItems.forEach(item => {
      cy.get('.order-item').contains(item.pastel).within(() => {
        cy.should('contain', `Qtd: ${item.quantidade}`);
        if (item.observacao) {
          cy.should('contain', item.observacao);
        }
      });
    });
  }

  getTotalItems() {
    return cy.get('.total-items-count');
  }
}

export default new OrderPage();