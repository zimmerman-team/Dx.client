/// <reference types="cypress" />

describe("testing footer for valid links", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("clicking logo should remain in home page", () => {
    cy.get("[data-cy=header-logo]").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("it should remain in home page", () => {
    cy.contains("a", "Dashboard").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("it should go to why dataxplorer page", () => {
    cy.get('[data-cy="nav-about-group"]').click();
    cy.contains("a", "Why").scrollIntoView().click();
    cy.contains("Unlock the Power of Data with Dataxplorer");
  });
  it("it should go to about page", () => {
    cy.get('[data-cy="nav-about-group"]').click();
    cy.contains("a", "Who We Are").scrollIntoView().click();
    cy.contains("Our Story");
  });
  it("it should go to Partners page", () => {
    cy.get('[data-cy="nav-about-group"]').click();
    cy.contains("a", "Our Partners").scrollIntoView().click();
    cy.contains("The Global Fund to fight AIDS, Tuberculosis and Malaria");
  });
  it("it should go to Pricing page", () => {
    cy.contains("a", "Pricing").scrollIntoView().click();
    cy.contains("Create stories that aren't a pain to build");
  });
  it("it should go to Contact page", () => {
    cy.contains("a", "Contact").scrollIntoView().click();
    cy.contains(
      "We like to get out and know about you to see our clients – we're more than happy to sit down and discuss a project. If you'd like to meet up, talk through a project, feel free to get in touch."
    );
  });
});
