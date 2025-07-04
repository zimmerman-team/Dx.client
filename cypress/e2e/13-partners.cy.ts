describe("Partners page tests", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.visit("/");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.contains("a", "Partners").scrollIntoView().click();
    cy.contains("Partner Case Study: The Global Fund");
  });

  it("it should click create story button", () => {
    cy.get('[data-cy="home-asset-dropdown-button"]').click();
    cy.get('[data-cy="home-create-story-button"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/story/new/initial");
  });
  it("it should click explore dashboard button", () => {
    cy.get('[data-cy="empower-block-explore-stories-link"]').click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/");
  });
  it("it should switch global fund tabs", () => {
    cy.get('[data-cy="about-tab"]').scrollIntoView().click();
    cy.get('[data-cy="grants-tab"]').click();
    cy.get('[data-cy="budgets-tab"]').click();
    cy.get('[data-cy="performance-tab"]').click();
  });
  it("it should click contact button", () => {
    cy.contains("a", "Contact Us").click();
    cy.wait(2000);
    cy.location("pathname").should("include", "/contact");
  });
});
