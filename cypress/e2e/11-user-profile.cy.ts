/// <reference types="cypress" />

const randomId = () => Cypress._.random(0, 1e6);
//@ts-ignore
const testname1 = `testname${randomId()}`;

describe("testing user profile", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");
    cy.get('[data-cy="cookie-btn"]').click();
    cy.get("[data-cy=navbar-profile-btn").click();
  });
  it("should test profile actions", () => {
    cy.intercept(`${apiUrl}/users/update-profile`).as("updateProfile");
    cy.get("input")
      .first()
      .type(`{selectall}{backspace}test user ${testname1}`);
    cy.get('[data-cy="save-profile-btn"]').click();
    cy.wait("@updateProfile");

    cy.contains('[data-cy="profile-tab"]', "billing").click();
    cy.contains('[data-cy="profile-tab"]', "profile").click();
    cy.get("input").first().should("have.value", `test user ${testname1}`);
  });

  it("should select all invoices", () => {
    cy.intercept(`${apiUrl}/stripe/invoices/**`).as("fetchInvoices");
    cy.contains('[data-cy="profile-tab"]', "billing").click();
    cy.wait("@fetchInvoices");
    cy.get('[data-cy="checkAllInvoice"]').click();
    cy.get('[data-cy="check-invoice"]').each(($el, index) => {
      cy.wrap($el).should("have.class", "Mui-checked"); // Example: Click each element
    });
  });
});
