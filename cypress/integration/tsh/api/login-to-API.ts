it('user should be able to login', () => {
  // programmatically log us in without needing the UI
  cy.request('POST', 'http://localhost:3001/login', {
    type: 'LOGIN',
    username: 'johndoe',
    password: 's3cret!',
    remember: true,
  }).then((resp) => {
    cy.log(resp.body);
    // write here Chai-jQuery assertion to check the response body's element value and status code
  });
});

//write here test but using fixture instead explicit body
it('user should be able to login using fixture', () => {
  cy.fixture('loginData').then((myFixture) => {
    cy.request('POST', 'http://localhost:3001/login', myFixture).then((resp) => {
      cy.log(resp.body);
    });
  });
});
