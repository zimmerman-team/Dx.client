import React, { useEffect, useState } from "react";
import axios from "axios";
import { useScript } from "./useScript";

interface Props {
  onFileSubmit: (file: File) => void;
  onCancel: () => void;
  googleDriveToken: string | null;
  setGoogleDriveToken: (
    newValue: string,
    options?: Cookies.CookieAttributes | undefined
  ) => void;
}

function useGoogleDrivePicker({
  onCancel,
  onFileSubmit,
  googleDriveToken,
  setGoogleDriveToken,
}: Props) {
  const gapiLoaded = useScript("https://apis.google.com/js/api.js");
  const gisLoaded = useScript("https://accounts.google.com/gsi/client");

  const [tokenClient, setTokenClient] = useState<any>(null);
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [usingFreshToken, setUsingFreshToken] = useState(false);
  const [clickedToOpen, setClickedToOpen] = useState(false);

  // Load picker once gapi is ready
  useEffect(() => {
    if (gapiLoaded) {
      window.gapi.load("picker", () => setPickerLoaded(true));
    }
  }, [gapiLoaded]);

  const handleGoogleDriveFilePicker = async (
    file: any,
    accessToken: string
  ) => {
    try {
      const response = await axios({
        url: `https://www.googleapis.com/drive/v3/files/${file.id}${
          file.type === "file" ? "?alt=media" : "/export?mimeType=text/csv"
        }`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "blob", // important
      });

      const b = response?.data;
      const gfile = new File([b], file.name, { type: "text/csv" });
      onFileSubmit(gfile);
    } catch (e) {
      console.log(e, "handleGoogleDriveFilePicker error");
    }
  };

  const openPickerWithToken = (token: string) => {
    const view = new window.google.picker.DocsView(
      window.google.picker.ViewId.SPREADSHEETS
    );

    const picker = new window.google.picker.PickerBuilder()
      .setDeveloperKey(process.env.REACT_APP_GOOGLE_API_DEV_KEY as string)
      .setOAuthToken(token)
      .addView(view)
      .setCallback((data: any) => {
        if (data.action === "picked") {
          handleGoogleDriveFilePicker(data.docs[0], token);
        } else if (data.action === "cancel") {
          onCancel();
        }
      })
      .build();

    picker.setVisible(true);
  };

  const openNewPicker = () => {
    setClickedToOpen(true);
    if (!pickerLoaded || !tokenClient) {
      console.warn("Google Picker not ready yet.");
      return;
    }

    // Request access token if not available
    if (!googleDriveToken) {
      tokenClient.requestAccessToken();
      return;
    }

    openPickerWithToken(googleDriveToken);
  };

  // Initialize OAuth token client
  useEffect(() => {
    if (gisLoaded) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_API_CLIENT_ID as string,
        scope: [
          "https://www.googleapis.com/auth/drive.readonly",
          "https://www.googleapis.com/auth/drive.file",
          "https://www.googleapis.com/auth/drive.metadata",
        ].join(" "),
        callback: (tokenResponse: any) => {
          setGoogleDriveToken(tokenResponse.access_token, {
            expires: new Date(new Date().getTime() + 3540 * 1000),
            httpsOnly: true,
            secure: true,
            sameSite: "strict",
          });
          setUsingFreshToken(true);
        },
      });
      setTokenClient(client);
    }
  }, [gisLoaded]);

  // Open picker when we have a fresh token
  useEffect(() => {
    // Only open if user clicked AND token just came in
    if (clickedToOpen && usingFreshToken && googleDriveToken) {
      openPickerWithToken(googleDriveToken);
      setUsingFreshToken(false);
      setClickedToOpen(false); // reset to avoid future auto-opens
    }
  }, [usingFreshToken, clickedToOpen, googleDriveToken]);
  return { getAccessTokenAndOpenPicker: openNewPicker };
}

export default useGoogleDrivePicker;
