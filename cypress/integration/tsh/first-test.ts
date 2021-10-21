describe('login', () => {
  it('logs in programmatically without using the UI', function () {
    cy.database('find', 'users').then(() => {
      cy.loginByXstate('johndoe', 's3cret');
    });
    cy.window().get('[data-test=sidenav-user-full-name]').should('contain', 'John');
  });
});
