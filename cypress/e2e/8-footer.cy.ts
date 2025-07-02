/// <reference types="cypress" />

describe("testing footer for valid links", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.visit("/");
    cy.get('[data-cy="cookie-btn"]').click();
  });
  it("it should verify footer copies", () => {
    cy.contains("2025 Dataxplorer All Rights Reserved").scrollIntoView();
    cy.contains("Tel: +3120 213 4466");
    cy.contains("Email: contact@dataxplorer.org");
    cy.contains("Keizersgracht 520H");
    cy.contains("1017 EK Amsterdam");
    cy.contains("The Netherlands");
  });

  it("it should remain in home page", () => {
    cy.contains("a", "Explore").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("clicking logo should remain in home page", () => {
    cy.get("[data-cy=footer-logo]").scrollIntoView().click();
    cy.contains("Create high impact data driven");
  });
  it("it should go to why dataxplorer page", () => {
    cy.contains("a", "Why Dataxplorer").scrollIntoView().click();
    cy.contains("Create high impact data driven stories");
  });
  it("it should go to why about page", () => {
    cy.contains("a", "About").scrollIntoView().click();
    cy.contains("Our Story");
  });
  it("it should go to Partners page", () => {
    cy.contains("a", "Partners").scrollIntoView().click();
    cy.contains("The Global Fund to fight AIDS, Tuberculosis and Malaria");
  });
  it("it should go to Pricing page", () => {
    cy.contains("a", "Pricing").scrollIntoView().click();
    cy.contains("Create stories that aren't a pain to build");
  });
  it("it should go to Contact page", () => {
    cy.contains("a", "Contact").scrollIntoView().click();
    cy.contains(
      "Schedule a free demo now or ask us any data related question you may have."
    );
  });

  it("should subscibe to email", () => {
    cy.contains("Stay Up To Date");
    cy.contains(
      "You will receive occasional emails from Dataxplorer. You always have choice to unsubscribe within every Email."
    );

    // Commenting this out since we disabled intercom on the test environment
    // cy.contains("SUBSCRIBE");
    // cy.get('input[placeholder="Email address"]').type(
    //   "emmanuella@zimmerman.team"
    // );
    // cy.intercept("POST", `${apiUrl}/users/subscribe-to-newsletter`).as(
    //   "subscribe"
    // );
    // cy.contains("SUBSCRIBE").click();
    // cy.wait("@subscribe");
    // cy.contains("Thank you for subscribing!");
  });

  it("is should display alid links in footer", () => {
    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("Email: contact@dataxplorer.org");

      cy.contains("Keizersgracht 520H");
      cy.contains("1017 EK Amsterdam");
      cy.contains("The Netherlands");
    });
    cy.get('[data-cy="home-footer"]').within(() => {
      cy.contains("a", "Explore").click();
      cy.location("pathname").should("include", "/");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Why Dataxplorer").click();
        cy.location("pathname").should("include", "/why-dataxplorer");
      });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "About").click();
        cy.location("pathname").should("include", "/about");
      });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Partners").click();
        cy.location("pathname").should("include", "/partners");
      });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Contact").click();
        cy.location("pathname").should("include", "/contact");
      });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Pricing").click();
        cy.location("pathname").should("include", "/pricing");
      });

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Privacy").invoke("removeAttr", "target").click();
      });

    cy.origin("https://drive.google.com", () => {
      cy.location("hostname").should("include", "drive.google.com");
    });

    cy.visit("/");

    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Terms and conditions")
          .invoke("removeAttr", "target")
          .click();
      });

    cy.origin("https://drive.google.com", () => {
      cy.location("origin").should("include", "https://drive.google.com");
    });
  });
});
