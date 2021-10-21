import { User } from "../../../src/models";

describe("User Settings", function () {
  beforeEach(function () {
    cy.task("db:seed");
    cy.database("find", "users").then((user: User) => {
      cy.loginViaApi(user.username);
    });

    cy.getByDataTestLike("sidenav-user-settings").click();
  });

  it("renders the user settings form", function () {
    cy.getByDataTest("user-settings-form").should("be.visible");
    cy.location("pathname").should("include", "/user/settings");
  });

  it("should display user setting form errors", function () {
    ["first", "last"].forEach((field) => {
      cy.getByDataTestLike(`${field}Name-input`).type("Abc").clear().blur();
      cy.get(`#user-settings-${field}Name-input-helper-text`)
        .should("be.visible")
        .and("contain", `Enter a ${field} name`);
    });

    cy.getByDataTestLike("email-input").type("abc").clear().blur();
    cy.get("#user-settings-email-input-helper-text")
      .should("be.visible")
      .and("contain", "Enter an email address");

    cy.getByDataTestLike("email-input").type("abc@bob.").blur();
    cy.get("#user-settings-email-input-helper-text")
      .should("be.visible")
      .and("contain", "Must contain a valid email address");

    cy.getByDataTestLike("phoneNumber-input").type("abc").clear().blur();
    cy.get("#user-settings-phoneNumber-input-helper-text")
      .should("be.visible")
      .and("contain", "Enter a phone number");

    cy.getByDataTestLike("phoneNumber-input").type("615-555-").blur();
    cy.get("#user-settings-phoneNumber-input-helper-text")
      .should("be.visible")
      .and("contain", "Phone number is not valid");

    cy.getByDataTest("user-settings-submit").should("be.disabled");
  });
});
