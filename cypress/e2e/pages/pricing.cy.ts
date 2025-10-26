/// <reference types="cypress" />

describe("Testing the Pricing page", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    // cy.setGoogleAccessToken();

    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");
    cy.injectAxe();

    cy.wait("@planData");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.get('[data-cy="app-bar"]').within(() => {
      cy.contains("a", "Pricing").click();
    });
  });

  it("Logs A11y violations to the terminal", () => {
    cy.checkA11y(undefined, undefined, undefined, true);
  });

  it("Displays the displaysthe current plan", () => {
    cy.get('[data-cy="plan-card"]').should("have.length", 4);

    cy.get('[data-cy="plan-button"]').contains("Current Plan");
  });

  it("Shows the billing page and settings", () => {
    cy.visit("/user-management/billing");

    cy.contains("button", "RENEW PLAN").should("be.visible");

    cy.contains("button", "UPGRADE PLAN").should("be.visible");

    cy.contains("button", "CANCEL PLAN").should("be.visible");

    cy.contains("button", "CHANGE PAYMENT METHOD").should("be.visible");

    cy.contains("button", "CHANGE BILLING INFO").should("be.visible");
  });
});
