import React from "react";
import ls from "@livesession/sdk";
import { useLocation } from "react-router-dom";

export const useRouteListener = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (window.location.hostname === "dataxplorer.org") {
      ls.init(import.meta.env.VITE_LIVE_SESSION_ID as string);
      ls.newPageView();
    }
  }, [location.pathname]);

  return null;
};
