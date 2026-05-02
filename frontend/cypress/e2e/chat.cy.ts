describe('Chat Flow', () => {
  it('User opens app, sees chat tab, types a question, gets a response', () => {
    cy.visit('/');
    cy.get('.welcome-card').should('be.visible');
    cy.get('#chat-input').type('How do I register to vote?');
    cy.get('#send-btn').click();
    cy.get('.chat-bubble.user').should('contain', 'register to vote');
    cy.get('.chat-bubble.bot').should('have.length.greaterThan', 1);
  });
});
