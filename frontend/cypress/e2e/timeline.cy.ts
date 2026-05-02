describe('Timeline Flow', () => {
  it('User clicks timeline tab, sees all 8 phases, clicks phase 1', () => {
    cy.visit('/');
    cy.contains('Timeline').click();
    cy.get('.timeline-step').should('have.length', 8);
    cy.get('.timeline-step').first().click();
    cy.get('.detail-panel').should('be.visible');
    cy.contains('Ask Matdaan about this').should('be.visible');
  });
});
