import React from "react";
import { useLocation } from "react-router-dom";
import {
  CssSnackbar,
  dataSetsCss,
  ISnackbarState,
} from "app/modules/dataset-module/routes/upload-module/style";
import { DatasetDataTable } from "app/modules/dataset-module/routes/upload-module/component/table/data-table";
import { ReactComponent as FullScreenIcon } from "app/modules/dataset-module/routes/upload-module/assets/full-screen.svg";
import { ReactComponent as CloseFullScreenIcon } from "app/modules/dataset-module/routes/upload-module/assets/close-full-screen.svg";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

export interface FinishedFragmentProps {
  data: any[];
  stats: any[];
  datasetId: string;
  dataTotalCount: number;
  dataTypes: never[];
  canDatasetEditDelete?: boolean;
  datasetDetails: DatasetListItemAPIModel;
  fullScreen?: boolean;
}

export default function TablePreview(props: FinishedFragmentProps) {
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const storyPage = queryParams.get("page") as string;
  const fromHome = location.search.includes("fromHome=true");
  let redirectPath = `/dataset/${props.datasetId}${
    fromHome ? "?fromHome=true" : ""
  }`;
  if (storyPage) {
    redirectPath += `?fromstory=true&page=${storyPage}`;
  }

  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
    message: "",
  });

  const [openFullScreenTooltip, setOpenFullScreenTooltip] =
    React.useState(false);

  const [closeFullScreenTooltip, setCloseFullScreenTooltip] =
    React.useState(false);

  const [openFullScreen, setOpenFullScreen] = React.useState(false);

  React.useEffect(() => {
    if (
      props.dataTotalCount > 0 &&
      location.pathname === "/dataset/new/upload"
    ) {
      setSnackbarState((prev) => ({
        ...prev,
        open: true,
        message: `${props.dataTotalCount} rows have been successfully processed!`,
      }));
    }
  }, [props.dataTotalCount]);

  const handleFullScreenDisplay = () => {
    setOpenFullScreen(true);
    setSnackbarState((prev) => ({
      ...prev,
      open: true,
      message: "Press ESC to exit Full Screen",
    }));
  };

  React.useEffect(() => {
    if (snackbarState.open) {
      if (snackbarState.message.includes("Press ESC to exit Full Screen")) {
        const timer = setTimeout(() => {
          setSnackbarState((prev) => ({ ...prev, open: false }));
        }, 30000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setSnackbarState((prev) => ({ ...prev, open: false }));
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [snackbarState.open]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenFullScreen(false);
        setSnackbarState((prev) => ({ ...prev, open: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div css={dataSetsCss}>
      <div
        css={`
          width: 100%;
          color: #231d2c;
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          position: relative;
        `}
      >
        <div
          css={`
            display: flex;
            width: 44px;
            height: 44px;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            position: absolute;
            right: 1%;
            top: 3%;
            border-radius: 10px;
            background: #6061e5;
            z-index: 1;

            /* Dark shadow */
            box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.6);
          `}
          onMouseOver={() => setOpenFullScreenTooltip(true)}
          onMouseLeave={() => setOpenFullScreenTooltip(false)}
          onClick={handleFullScreenDisplay}
          data-cy="dataset-full-screen-btn"
        >
          <FullScreenIcon width={32} height={32} />
        </div>

        <DatasetDataTable
          data={props.data}
          stats={props.stats}
          dataTypes={props.dataTypes}
          datasetId={props.datasetId}
        />

        <div
          css={`
            background: rgba(0, 0, 0, 0.75);
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1101;
            width: 100vw;
            height: 100vh;
            padding: 26px 100px 26px 108px;
            @media (max-width: 450px) {
              padding: 26px;
            }
          `}
          hidden={!openFullScreen}
          data-cy="dataset-full-screen-view"
        >
          <div
            css={`
              display: flex;
              column-gap: 13px;
              align-items: center;
            `}
          >
            <div
              css={`
                width: 32px;
                height: 32px;
                cursor: pointer;
                margin-bottom: 15px;
                position: relative;
              `}
              onMouseOver={() => setCloseFullScreenTooltip(true)}
              onMouseLeave={() => setCloseFullScreenTooltip(false)}
              onClick={() => setOpenFullScreen(false)}
              data-cy="dataset-close-full-screen-btn"
            >
              <CloseFullScreenIcon width={32} height={32} />

              <div
                css={`
                  background: #626262;
                  color: #fff;
                  font-size: 12px;
                  position: absolute;
                  top: 60%;
                  left: 110%;
                  width: max-content;
                  padding: 1px 8px;
                  border-radius: 4px;
                  user-select: none;
                `}
                hidden={!closeFullScreenTooltip}
              >
                Close Full Screen
              </div>
            </div>
          </div>
          <DatasetDataTable
            data={props.data}
            stats={props.stats}
            dataTypes={props.dataTypes}
            datasetId={props.datasetId}
            fullScreen={props.fullScreen}
          />
        </div>
      </div>
      <CssSnackbar
        anchorOrigin={{
          vertical: snackbarState.vertical,
          horizontal: snackbarState.horizontal,
        }}
        open={snackbarState.open}
        onClose={() =>
          setSnackbarState((prev) => ({ ...prev, open: false, message: "" }))
        }
        message={snackbarState.message}
        key={snackbarState.vertical + snackbarState.horizontal}
      />
    </div>
  );
}
