import React from "react";
import UserProfileLayout from "./layout";
import { useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { LogOutIcon, RightIcon } from "./component/icons";
import { useTitle } from "react-use";

export default function UserProfileModule() {
  useTitle("DX Dataxplorer - User Management");

  const history = useHistory();
  const { isAuthenticated, isLoading } = useAuth0();

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      history.push("/");
    }
  }, [isLoading, isAuthenticated]);

  return <UserProfileLayout />;
}
