class NotificationPage {
  visit() {
    cy.visit('/notifications');
  }

  assertNotificationExists(message) {
    cy.get('.notification-list').should('be.visible');
    cy.get('.notification-item').contains(message).should('be.visible');
  }

  assertNotificationCount(count) {
    cy.get('.notification-item').should('have.length', count);
  }

  clearNotifications() {
    cy.get('#btn-clear-notifications').click();
  }

  getLatestNotification() {
    return cy.get('.notification-item').first();
  }
}

export default new NotificationPage();