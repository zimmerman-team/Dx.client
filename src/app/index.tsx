// cc:application base#;application index

import React from "react";
import Providers from "app/Providers";
import { MainRoutes } from "app/Routes";
import { AppDialogs } from "app/components/Dialogs";
import { CookieDialog } from "app/components/Dialogs/CookieDialog";
import { PlanDialog } from "./components/Dialogs/PlanDialog";

export function App() {
  return (
    <Providers>
      <AppDialogs />
      <CookieDialog open data-testid="cookie-dialog" />
      <PlanDialog />
      <MainRoutes />
    </Providers>
  );
}
