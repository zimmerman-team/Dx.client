import { useAuth0 } from "@auth0/auth0-react";
import { APPLICATION_JSON } from "app/state/api";
import { useStoreActions } from "app/state/store/hooks";
import axios from "axios";
import React from "react";

export default function useProfileSettings() {
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [enableButton, setEnableButton] = React.useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const { getAccessTokenSilently, logout } = useAuth0();

  const setToken = useStoreActions((actions) => actions.AuthToken.setValue);

  const clearDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.clear
  );
  const clearCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.clear
  );
  const clearStories = useStoreActions(
    (actions) => actions.stories.StoryGetList.clear
  );

  function clearAssets() {
    setToken("");
    clearDatasets();
    clearCharts();
    clearStories();
  }

  const deleteUserAccount = async () => {
    return getAccessTokenSilently().then(async (newToken) => {
      return await axios.post(
        `${process.env.REACT_APP_API}/users/delete-account`,
        {},
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
    });
  };

  const handleDelete = () => {
    setLoading(true);
    deleteUserAccount()
      .then(() => {
        if (window?.Intercom) {
          window.Intercom("shutdown");
        }
        setLoading(false);
        setModalDisplay(false);
        setEnableButton(false);
        clearAssets();
        logout({
          logoutParams: {
            returnTo: window.location.origin,
          },
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };
  return {
    setModalDisplay,
    handleDelete,
    handleInputChange,
    inputValue,
    enableButton,
    loading,
    modalDisplay,
  };
}
