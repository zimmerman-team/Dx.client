import { defineConfig } from "cypress";

require("dotenv").config();

export default defineConfig({
  viewportHeight: 820,
  viewportWidth: 1440,
  projectId: process.env.CYPRESS_PROJECT_ID,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      auth0_username: process.env.AUTH0_USERNAME,
      auth0_password: process.env.AUTH0_PASSWORD,
      auth0_domain: process.env.REACT_APP_AUTH0_DOMAIN,
      auth0_audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      auth0_client_id: process.env.REACT_APP_AUTH0_CLIENT,
      api_url: process.env.REACT_APP_API,
      base_url: process.env.REACT_APP_BASE_URL,
      google_client_id_test: process.env.GOOGLE_CLIENT_ID_TEST,
      google_client_secret_test: process.env.GOOGLE_CLIENT_SECRET_TEST,
      google_refresh_token_test: process.env.GOOGLE_REFRESH_TOKEN_TEST,
    },
    baseUrl: process.env.REACT_APP_BASE_URL,
  },
});
