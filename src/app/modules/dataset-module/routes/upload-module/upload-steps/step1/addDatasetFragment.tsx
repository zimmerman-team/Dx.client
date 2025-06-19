/**third party */
import React, { useCallback } from "react";

/** project */

import { DropZone } from "app/modules/dataset-module/routes/upload-module/component/dropzone";
import LocalIcon from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/local";
import GoogleIcon from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/google";
import MicrosoftIcon from "app/modules/dataset-module/routes/upload-module/assets/upload-options-icons/microsoft";
import UploadOption from "app/modules/dataset-module/routes/upload-module/component/uploadOption";
import { useCookie } from "react-use";
import useGoogleDrivePicker from "app/hooks/useGoogleDrivePicker";
import { useOneDrivePicker } from "app/hooks/useOneDrivePicker";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";

interface Props {
  disabled: boolean;
  onFileSubmit: (file: File) => void;
  processingError: string | null;
  activeOption: string | null;
  setActiveOption: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddDatasetFragment(props: Props) {
  const [googleDriveToken, setGoogleDriveToken, deleteGoogleDriveToken] =
    useCookie("googleDriveToken");

  const { userPlan } = useCheckUserPlan();

  const { getAccessTokenAndOpenPicker } = useGoogleDrivePicker({
    onCancel: () => {
      props.setActiveOption(null);
    },
    onFileSubmit: (file: File) => {
      props.onFileSubmit(file);
    },
    googleDriveToken,
    setGoogleDriveToken,
  });

  const { launchPicker, clearToken, connected } = useOneDrivePicker({
    onCancel: () => {
      props.setActiveOption(null);
    },
    onFileSubmit: (file: File) => {
      props.onFileSubmit(file);
    },
    onDownloadStart: () => {
      props.setActiveStep(1);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      props.onFileSubmit(acceptedFiles[0]);
    }
  }, []);

  const databaseConnection = "DataBase Connection";
  const comingSoon = "Coming Soon";

  const uploadOptions = [
    {
      name: "Local upload",
      type: "Table Dataset",
      formats: ["CSV", "XSLX", "JSON"],
      icon: <LocalIcon />,
      onClick: () => {},
      upgradeRequired: false,
    },
    {
      name: "Google Drive",
      type: "Upload",
      formats: ["CSV", "XSLX", "JSON"],
      icon: <GoogleIcon />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        getAccessTokenAndOpenPicker();
      },
      canConnect: true,
      connected: !!googleDriveToken,
      onLogout: () => {
        deleteGoogleDriveToken();
      },
      upgradeRequired: userPlan?.planData.name === "Free",
    },
    {
      name: "Microsoft Cloud",
      type: "Upload",
      formats: ["CSV", "XSLX", "JSON"],
      icon: <MicrosoftIcon />,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        launchPicker();
      },
      canConnect: true,
      connected: connected,
      onLogout: async () => {
        await clearToken();
      },
      upgradeRequired: userPlan?.planData.name === "Free",
    },
    // {
    //   name: "API Connection",
    //   type: "URL, JSON or XML root",
    //   formats: ["CSV", "XSLX", "JSON", "ODS", "SQLite"],
    //   icon: <ApiIcon />,
    //   onClick: () => {},
    //   upgradeRequired: false,
    // },
    // {
    //   name: "MSSQL",
    //   type: databaseConnection,
    //   formats: [comingSoon],
    //   icon: <img width={30} height={33.462} src={MSSQLIcon} alt="mssql-logo" />,
    //   onClick: () => {},
    //   upgradeRequired: false,
    // },
    // {
    //   name: "MYSQL",
    //   type: databaseConnection,
    //   formats: [comingSoon],
    //   icon: <img width={30} height={30} src={MYSQLIcon} alt="mysql-logo" />,
    //   onClick: () => {},
    //   upgradeRequired: false,
    // },
    // {
    //   name: "PostgreSQL",
    //   type: databaseConnection,
    //   formats: [comingSoon],
    //   icon: <PostgresIcon />,
    //   onClick: () => {},
    //   upgradeRequired: false,
    // },
    // {
    //   name: "MongoDB",
    //   type: databaseConnection,
    //   formats: [comingSoon],
    //   icon: <MongoDbIcon />,
    //   onClick: () => {},
    //   upgradeRequired: false,
    // },
    // {
    //   name: "Hubspot",
    //   type: databaseConnection,
    //   formats: [comingSoon],
    //   icon: <HubspotIcon />,
    //   onClick: () => {},
    //   upgradeRequired: false,
    // },
  ];

  return (
    <>
      <div>
        <div
          css={`
            color: #231d2c;
            margin-bottom: 30px;
            > h2 {
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 24px;
              margin: 0;
            }
            > p {
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              margin: 0;
              font-size: 14px;
            }
          `}
        >
          <h2>Upload Your Data</h2>
          <p>
            Connect your data by uploading a file or connect to your cloud
            storage.
          </p>
        </div>

        {props.activeOption === "Local upload" ? (
          <div
            css={`
              display: flex;
              align-items: stretch;
              gap: 30px;
              height: 300px;
            `}
          >
            <DropZone
              disabled={props.disabled}
              uploadError={!!props.processingError}
              onDrop={onDrop}
            />
            <div
              css={`
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex: 1;
              `}
            >
              {uploadOptions.slice(1).map((option) => (
                <UploadOption
                  key={option.name}
                  name={option.name}
                  type={option.type}
                  formats={option.formats}
                  icon={option.icon}
                  onClick={option.onClick}
                  setActiveOption={props.setActiveOption}
                  canConnect={option.canConnect}
                  connected={option.connected}
                  onLogout={option.onLogout}
                  upgradeRequired={option.upgradeRequired}
                />
              ))}
            </div>
          </div>
        ) : (
          <div
            css={`
              display: grid;
              grid-template-columns: repeat(3, minmax(0, 1fr));
              gap: 10px;
            `}
          >
            {uploadOptions.map((option) => (
              <UploadOption
                key={option.name}
                name={option.name}
                type={option.type}
                formats={option.formats}
                icon={option.icon}
                onClick={option.onClick}
                setActiveOption={props.setActiveOption}
                canConnect={option.canConnect}
                connected={option.connected}
                onLogout={option.onLogout}
                upgradeRequired={option.upgradeRequired}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
