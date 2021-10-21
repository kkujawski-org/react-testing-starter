describe("payment", () => {
  it("user should be able to login", () => {
    // programmatically log us in without needing the UI
    cy.request("POST", "http://localhost:3001/login", {
      type: "LOGIN",
      username: "johndoe",
      password: "s3cret",
      remember: true,
    })
      .then((resp) => {
        cy.log(resp.body);
      })
      .then((loginToApp) => {
        cy.visit("http://localhost:3000/user/settings");
      });
  });

  it("logs in programmatically without using the UI", function () {
    // destructuring assignment of the this.currentUser object

    // programmatically log us in without needing the UI
    cy.database("find", "users").then(() => {
      cy.loginByXstate("johndoe", "s3cret");
    });

    // now that we're logged in, we can visit
    // any kind of restricted route!

    // our auth cookie should be present
    // cy.getCookie('your-session-cookie').should('exist')

    // UI should reflect this user being logged in
    cy.window().get("h1").should("contain", "jane.lane");
  });
});
