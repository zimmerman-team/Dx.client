/// <reference types="cypress" />

describe("testing footer for valid links", () => {
  const apiUrl = Cypress.env("api_url");
  beforeEach(() => {
    cy.visit("/");
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
  it("it should verify footer copies", () => {
    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("Tel: +3120 213 4466");
        cy.contains("Email: contact@dataxplorer.org");
        cy.contains("Keizersgracht 520H");
        cy.contains("1017 EK Amsterdam");
        cy.contains("The Netherlands");
      });
  });

  it("it should remain in home page", () => {
    cy.get('[data-cy="footer-links"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Dashboard").first().scrollIntoView().click();
      });

    cy.contains("Create high impact data driven");
  });
  it("clicking logo should remain in home page", () => {
    cy.get('[data-cy="home-footer"]')
      .scrollIntoView()
      .within(() => {
        cy.get("[data-cy=footer-logo]").scrollIntoView().click();
      });
    cy.contains("Create high impact data driven");
  });
  it("it should go to why dataxplorer page", () => {
    cy.get('[data-cy="footer-links"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Why").scrollIntoView().click();
      });
    cy.contains("Create high impact data driven stories");
  });
  it("it should go to why about page", () => {
    cy.get('[data-cy="footer-links"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Who We Are").scrollIntoView().click();
      });
    cy.contains("Our Story");
  });
  it("it should go to Partners page", () => {
    cy.get('[data-cy="footer-links"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Our Partners").scrollIntoView().click();
      });
    cy.contains("The Global Fund to fight AIDS, Tuberculosis and Malaria");
  });
  it("it should go to Pricing page", () => {
    cy.get('[data-cy="footer-links"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Pricing").scrollIntoView().click();
      });
    cy.contains("Create stories that aren't a pain to build");
  });
  it("it should go to Contact page", () => {
    cy.get('[data-cy="footer-links"]')
      .scrollIntoView()
      .within(() => {
        cy.contains("a", "Contact Us").scrollIntoView().click();
      });
    cy.contains(
      "We like to get out and know about you to see our clients – we're more than happy to sit down and discuss a project. If you'd like to meet up, talk through a project, feel free to get in touch."
    );
  });

  it("should subscibe to email", () => {
    cy.contains("Stay Up To Date");
    cy.contains(
      "You will receive occasional emails from DataXplorer. You can unsubscribe anytime."
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
