/// <reference types="cypress" />

/* TESTS TO COVER

- Local Upload Dataset - Done
- External Search Upload Dataset - Done
- Google Drive Upload Dataset - Can't be tested for now - Google login doesn't work on test controlled environments

- Edit Dataset - Done
- Delete Dataset - Done
- Duplicate Dataset - Done

*/

//@ts-ignore
const randomId = () => Cypress._.random(0, 1e8);
//@ts-ignore
const testname1 = `testname${randomId()}`;
const testname2 = `testname${randomId()}`;

describe("Testing connecting data on DX", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    // restore login session
    cy.restoreLocalStorageCache();
    // cy.setGoogleAccessToken();

    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");

    cy.get('[data-cy="cookie-btn"]').click();
    cy.intercept(`${apiUrl}/external-sources/search?q=*`).as("getDefaultData");
    cy.get('[data-cy="home-asset-dropdown-button"]').click();
    cy.get('[data-cy="home-connect-dataset-button"]').click();
    cy.wait(2000);
  });

  it("Can filter results by source in the external search", () => {
    cy.wait("@getDefaultData").then((interception) => {
      cy.wait(2000);
      cy.contains('[data-cy="source-category-button"]', "Kaggle").click();
      cy.wait("@getDefaultData");
      cy.get('[data-cy="external-search-card-Kaggle"]').should(
        "have.length.greaterThan",
        1
      );
    });
    cy.wait(2000);
    cy.contains('[data-cy="source-category-button"]', "Kaggle").click();

    cy.contains('[data-cy="source-category-button"]', "WHO").click();
    cy.wait("@getDefaultData");

    cy.get('[data-cy="external-search-card-Kaggle"]').should("have.length", 0);
    cy.get('[data-cy="external-search-card-WHO"]').should("be.visible");
  });

  //Feature not implemented yet so can not test
  // it("Can import data from External Search - TGF", () => {
  //   cy.wait("@getDefaultData").then((interception) => {
  //     cy.wait(2000);
  //     cy.contains('[data-cy="source-category-button"]', "TGF").click();
  //     cy.wait("@getDefaultData");
  //     cy.get('[data-cy="external-search-card-TGF"]').should(
  //       "have.length.greaterThan",
  //       1
  //     );
  //   });

  //   cy.get('[data-cy="open-search-button"]').click();
  //   cy.intercept(
  //     `${apiUrl}/external-sources/search?q=Exclusive%20breastfeeding*`
  //   ).as("getDefaultData2");
  //   cy.wait(2000);
  //   cy.get('[data-cy="filter-search-input"]').type("Exclusive breastfeeding");

  //   cy.wait("@getDefaultData2").then((interception) => {
  //     cy.get('[data-cy="external-search-card-TGF"]').should(
  //       "have.length.greaterThan",
  //       1
  //     );
  //   });

  //   cy.intercept(`${apiUrl}/external-sources/download`).as("downloadData");
  //   cy.get('[data-cy="external-search-card-TGF"]')
  //     .first()
  //     .trigger("mouseover")
  //     .within(() => {
  //       cy.get('[data-cy="import-to-dx-button"]').click();
  //     });
  //   cy.wait("@downloadData");

  //   cy.get('[data-cy="dataset-metadata-title"]').type(
  //     `{selectall}{backspace}${testname1}`
  //   );
  //   cy.get('[data-cy="dataset-metadata-description"]').type(
  //     `{selectall}{backspace}${testname1}`
  //   );
  //   cy.get('[data-cy="dataset-metadata-source"]').type(
  //     "{selectall}{backspace}Rawgraphs"
  //   );
  //   cy.get('[data-cy="dataset-metadata-link"]').type(
  //     "{selectall}{backspace}https://notavailableexternal.com"
  //   );
  //   cy.get('[data-cy="dataset-metadata-category"]').click();
  //   cy.get('[data-value="Social"]').click();
  //   cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
  //   cy.intercept(`${apiUrl}/datasets`).as("submitData");
  //   cy.get('[data-cy="dataset-metadata-submit"]').click();

  //   cy.wait("@submitData");
  //   cy.contains(testname1).should("be.visible");
  // });

  it("Can import data from External Search - WHO", () => {
    cy.wait("@getDefaultData").then((interception) => {
      cy.wait(2000);
      cy.contains('[data-cy="source-category-button"]', "WHO").click();
      cy.wait("@getDefaultData");
      cy.get('[data-cy="external-search-card-WHO"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(
      `${apiUrl}/external-sources/search?q=Exclusive%20breastfeeding*`
    ).as("getDefaultData2");
    cy.wait(2000);
    cy.get('[data-cy="external-search-input"]').type("Exclusive breastfeeding");
    cy.get('[data-cy="external-search-button"]').click();
    cy.wait("@getDefaultData2").then((interception) => {
      cy.get('[data-cy="external-search-card-WHO"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/download`).as("downloadData");
    cy.get('[data-cy="external-search-card-WHO"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="import-to-dx-button"]').click();
      });
    cy.wait("@downloadData");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace}Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace}https://notavailableexternal.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains(testname1).should("be.visible");
  });

  it("Can import data from External Search - HDX", () => {
    cy.wait("@getDefaultData").then((interception) => {
      cy.wait(2000);
      cy.contains('[data-cy="source-category-button"]', "HDX").click();
      cy.wait("@getDefaultData");
      cy.get('[data-cy="external-search-card-HDX"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/search?q=n*`).as(
      "getDefaultData2"
    );
    cy.wait(2000);
    cy.get('[data-cy="external-search-input"]').type("n");
    cy.get('[data-cy="external-search-button"]').click();

    cy.wait("@getDefaultData2").then((interception) => {
      cy.get('[data-cy="external-search-card-HDX"]').should(
        "have.length.greaterThan",
        0
      );
    });

    cy.intercept(`${apiUrl}/external-sources/download`).as("downloadData");
    cy.get('[data-cy="external-search-card-HDX"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="import-to-dx-button"]').click();
      });
    cy.wait("@downloadData");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace}Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace}https://notavailableexternal.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains(testname1).should("be.visible");
  });
  it("Can import data from External Search - World Bank", () => {
    cy.wait("@getDefaultData").then((interception) => {
      cy.wait(2000);
      cy.contains('[data-cy="source-category-button"]', "World Bank").click();
      cy.wait("@getDefaultData");
      cy.get('[data-cy="external-search-card-World Bank"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/search?q=Voice%20and*`).as(
      "getDefaultData2"
    );

    cy.wait(2000);
    cy.get('[data-cy="external-search-input"]').type("Voice and");
    cy.get('[data-cy="external-search-button"]').click();

    cy.wait("@getDefaultData2").then((interception) => {
      cy.get('[data-cy="external-search-card-World Bank"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/download`).as("downloadData");
    cy.get('[data-cy="external-search-card-World Bank"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="import-to-dx-button"]').click();
      });
    cy.wait("@downloadData");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace}Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace}https://notavailableexternal.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains(testname1).should("be.visible");
  });

  it("Can import data from External Search - Kaggle", () => {
    cy.wait("@getDefaultData").then((interception) => {
      cy.wait(2000);
      cy.contains('[data-cy="source-category-button"]', "Kaggle").click();
      cy.wait("@getDefaultData");
      cy.get('[data-cy="external-search-card-Kaggle"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/search?q=men*`).as(
      "getDefaultData2"
    );
    cy.wait(2000);

    cy.get('[data-cy="external-search-input"]').type("men");
    cy.get('[data-cy="external-search-button"]').click();

    cy.wait("@getDefaultData2").then((interception) => {
      cy.get('[data-cy="external-search-card-Kaggle"]').should(
        "have.length.greaterThan",
        1
      );
    });

    cy.intercept(`${apiUrl}/external-sources/download`).as("downloadData");
    cy.get('[data-cy="external-search-card-Kaggle"]')
      .first()
      .trigger("mouseover")
      .within(() => {
        cy.get('[data-cy="import-to-dx-button"]').click();
      });
    cy.wait("@downloadData");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      `{selectall}{backspace}${testname1}`
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace}Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace}https://notavailableexternal.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains(testname1).should("be.visible");
  });

  // it("Can import data from Google Drive", () => {
  //   cy.intercept(
  //     "https://www.googleapis.com/drive/v3/files/1ZMtAYFviJrhITddRe7ulDNGCL5F0Rur7?alt=media"
  //   ).as("googleDrivePicker");

  //   // Assuming your application has a function that's called when a file is selected from the picker
  //   cy.visit("/dataset/new/upload");
  //   cy.window().then((win) => {
  //     // Manually trigger the callback function with mock data
  //     const mockFileData = {
  //       id: "1ZMtAYFviJrhITddRe7ulDNGCL5F0Rur7",
  //       name: "WineQT.csv",
  //       kind: "drive#file",
  //       mimeType: "text/csv",
  //       type: "file",
  //       // Add any other properties your callback function expects
  //     };
  //     // Calling the picker function with the mock data - The picker window is not accessible in Cypress
  //     // @ts-ignore
  //     win.handleGoogleDriveFilePicker(
  //       mockFileData,
  //       localStorage.getItem("google_access_token")
  //     );
  //   });
  //   cy.wait(`@googleDrivePicker`);

  //   cy.get('[data-cy="dataset-metadata-title"]').type("Wine Tasting");

  //   cy.get('[data-cy="dataset-metadata-description"]').type("Wine Tasting");
  //   cy.get('[data-cy="dataset-metadata-source"]').type("Rawgraphs");
  //   cy.get('[data-cy="dataset-metadata-link"]').type("Not available");
  //   cy.get('[data-cy="dataset-metadata-category"]').click();
  //   cy.get('[data-value="Social"]').click();
  //   cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
  //   cy.intercept(`${apiUrl}/datasets`).as("submitData");
  //   cy.get('[data-cy="dataset-metadata-submit"]').click();

  //   cy.wait("@submitData");
  //   cy.contains("Wine Tasting").should("be.visible");
  // });

  it.only("Can import data through local upload", () => {
    cy.get('[data-cy="file-upload-tab"]').click();
    cy.get('[data-cy="upload-option-button"').first().click();
    cy.get('[data-cy="local-upload-input"]').as("fileInput");
    cy.fixture("football-players.csv").then((fileContent) => {
      cy.get("@fileInput").attachFile({
        fileContent: fileContent.toString(),
        fileName: "football-players.csv",
        mimeType: "text/csv",
      });
    });
    cy.get('[data-cy="dataset-metadata-title"]').type("Football Players");
    cy.get('[data-cy="dataset-metadata-description"]').type(
      "Football Players Data"
    );
    cy.get('[data-cy="dataset-metadata-source"]').type("Rawgraphs");
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "https://notavailabledata.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains("Football Players").should("be.visible");
  });

  it.only("Can import another dataset through local upload", () => {
    cy.get('[data-cy="file-upload-tab"]').click();
    cy.get('[data-cy="upload-option-button"').first().click();
    cy.get('[data-cy="local-upload-input"]').as("fileInput");
    cy.fixture("football-players.csv").then((fileContent) => {
      cy.get("@fileInput").attachFile({
        fileContent: fileContent.toString(),
        fileName: "football-players.csv",
        mimeType: "text/csv",
      });
    });
    cy.get('[data-cy="dataset-metadata-title"]').type("ChartDataset");
    cy.get('[data-cy="dataset-metadata-description"]').type(
      "ChartDataset Data"
    );
    cy.get('[data-cy="dataset-metadata-source"]').type("Rawgraphs");
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "https://notavailabledataset.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept(`${apiUrl}/datasets`).as("submitData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@submitData");
    cy.contains("ChartDataset").should("be.visible");
  });
});

describe("Edit, Delete and Duplicate Dataset", () => {
  const apiUrl = Cypress.env("api_url");

  beforeEach(() => {
    cy.restoreLocalStorageCache();
    cy.intercept("GET", `${apiUrl}/users/plan-data`).as("planData");

    cy.visit("/");

    cy.wait("@planData");
    cy.get('[data-cy="cookie-btn"]').click();

    cy.intercept("GET", `${apiUrl}/datasets?filter=*`).as("fetchDatasets");

    cy.get('[data-cy="home-data-tab"]').scrollIntoView().click();

    cy.wait("@fetchDatasets");
  });

  it.only("Can Edit a Dataset", () => {
    cy.contains('[data-cy="dataset-grid-item"]', "Football Players")
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });
    cy.intercept("GET", `${apiUrl}/datasets/*`).as("fetchDataset");
    cy.get('[data-cy="dataset-grid-item-edit-btn"]').click();

    cy.wait("@fetchDataset");

    cy.get('[data-cy="dataset-metadata-title"]').type(
      `{selectall}{backspace}${testname2}`
    );
    cy.get('[data-cy="dataset-metadata-description"]').type(
      "{selectall}{backspace} Soccer"
    );
    cy.get('[data-cy="dataset-metadata-source"]').type(
      "{selectall}{backspace} Rawgraphs"
    );
    cy.get('[data-cy="dataset-metadata-link"]').type(
      "{selectall}{backspace}https://notavailableedit.com"
    );
    cy.get('[data-cy="dataset-metadata-category"]').click();
    cy.get('[data-value="Social"]').click();
    cy.get('[data-cy="dataset-metadata-submit"]').scrollIntoView();
    cy.intercept("PATCH", `${apiUrl}/datasets/*`).as("editData");
    cy.get('[data-cy="dataset-metadata-submit"]').click();

    cy.wait("@editData");

    cy.wait("@fetchDatasets");
    cy.contains(testname2).scrollIntoView().should("be.visible");
  });

  it("Can duplicate a dataset", () => {
    cy.contains('[data-cy="dataset-grid-item"]', testname2)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-duplicate-btn"]').click();

    cy.wait("@fetchDatasets");

    cy.get('[data-cy="dataset-grid-item"]')
      .contains(`(Copy)${testname2}`)
      .scrollIntoView()
      .should("be.visible");
  });

  // it("Can switch to fullscreen on the dataset detail page", () => {
  //   cy.get('[data-cy="dataset-grid-item"]').first().scrollIntoView().click();

  //   cy.location("pathname").should("include", "/dataset/");

  //   cy.get('[data-cy="dataset-full-screen-btn"]').click();

  //   cy.get('[data-cy="dataset-full-screen-view"]').should("be.visible");

  //   cy.get('[data-cy="dataset-close-full-screen-btn"]').click();

  //   cy.get('[data-cy="dataset-full-screen-view"]').should("not.be.visible");
  // });

  it("Can go back to the library from the dataset detail page", () => {
    cy.get('[data-cy="dataset-grid-item"]').first().scrollIntoView().click();

    cy.location("pathname").should("include", "/dataset/");

    cy.get('[data-cy="dataset-back-to-library-btn"]').click();

    cy.location("pathname").should("not.include", "/dataset");
  });

  it("Can delete dataset", () => {
    cy.get("[data-cy=home-search-button]").first().click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(testname2);

    cy.wait("@fetchDatasets");

    cy.contains('[data-cy="dataset-grid-item"]', `(Copy)${testname2}`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
      cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteDataset");

    cy.wait("@fetchDatasets");

    /// Delete main test dataset

    cy.get("[data-cy=home-search-button]").first().click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${testname2}`
    );

    cy.wait("@fetchDatasets");

    cy.contains('[data-cy="dataset-grid-item"]', `${testname2}`)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
      cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteDataset");

    cy.wait("@fetchDatasets");

    // cy.get('[data-cy="dataset-grid-item"]')
    //   .contains("Soccer Players (Copy)")
    //   .should("not.exist");

    // cy.get("[data-cy=home-search-button]").click();
    // cy.get("[data-cy=filter-search-input]").type(
    //   "{selectall}{backspace}Wine Tasting"
    // );

    // cy.wait("@fetchDatasets");

    // cy.contains('[data-cy="dataset-grid-item"]', "Wine Tasting")
    //   .first()
    //   .scrollIntoView()
    //   .within(() => {
    //     cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
    //   });

    // cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    // cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    // cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
    //   cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE{enter}");
    // });

    // cy.wait("@deleteDataset");

    // cy.wait("@fetchDatasets");

    // cy.get('[data-cy="dataset-grid-item"]')
    //   .contains("Wine Tasting")
    //   .should("not.exist");

    cy.get('[data-cy="home-search-button"]').click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${testname1}`
    );

    cy.wait("@fetchDatasets");

    cy.contains('[data-cy="dataset-grid-item"]', testname1)
      .first()
      .scrollIntoView()
      .within(() => {
        cy.get('[data-cy="dataset-grid-item-menu-btn"]').click();
      });

    cy.get('[data-cy="dataset-grid-item-delete-btn"]').click();
    cy.intercept("DELETE", `${apiUrl}/datasets/*`).as("deleteDataset");

    cy.get('[data-cy="delete-dataset-item-form"]').within(() => {
      cy.get('[data-cy="delete-dataset-item-input"]').type("DELETE{enter}");
    });

    cy.wait("@deleteDataset");

    cy.wait("@fetchDatasets");

    cy.get("[data-cy=home-search-button]").click();
    cy.wait(2000);
    cy.get("[data-cy=filter-search-input]").type(
      `{selectall}{backspace}${testname1}`
    );
    cy.wait("@fetchDatasets");

    cy.contains('[data-cy="dataset-grid-item"]', testname1).should(
      "have.length",
      0
    );
  });
});
