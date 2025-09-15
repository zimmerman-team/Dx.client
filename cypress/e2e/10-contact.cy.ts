/// <reference types="cypress" />

describe("testing contact form", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.visit("/contact");
    cy.injectAxe();
    cy.get('[data-cy="cookie-btn"]').click();
  });
  it("Logs A11y violations to the terminal", () => {
    cy.checkA11y(
      "",
      {
        retries: 3,
      },
      (violations) => cy.printA11yViolations(violations)
    );
  });
  it("should submit contact form", () => {
    cy.intercept(`${apiUrl}/users/send-contact-form-to-intercom`).as(
      "submitForm"
    );
    cy.get('input[name="email"]').first().type("emmanuella@zimmerman.team");
    cy.get('input[name="firstName"]').type("Emmanuella");
    cy.get('input[name="lastName"]').type("Okorie");
    cy.get('textarea[name="message"]').type("Testing");
    cy.contains("button", "Send Message").click();

    cy.wait("@submitForm");
    cy.get("body")
      .find('[data-cy="contact-form-alert"]')
      .scrollIntoView()
      .should("be.visible");
  });
});
