describe('Booth Finder Flow', () => {
  it('User clicks Find Booth tab, sees location request prompt', () => {
    cy.visit('/');
    cy.contains('Find Booth').click();
    cy.get('.booth-prompt').should('be.visible');
    cy.contains('Find My Nearest Booth').should('be.visible');
  });
});
