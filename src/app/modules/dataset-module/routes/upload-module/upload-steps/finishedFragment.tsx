import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  dataSetsCss,
  mobileDescriptioncss,
} from "app/modules/dataset-module/routes/upload-module/style";
import { useStoreActions } from "app/state/store/hooks";
import { DatasetDataTable } from "app/modules/dataset-module/routes/upload-module/component/table/data-table";
import { CssSnackbar, ISnackbarState } from "./previewFragment";
import { ReactComponent as FullScreenIcon } from "app/modules/dataset-module/routes/upload-module/assets/full-screen.svg";
import { ReactComponent as CloseFullScreenIcon } from "app/modules/dataset-module/routes/upload-module/assets/close-full-screen.svg";
import { ArrowBack } from "@material-ui/icons";
import { useMediaQuery } from "usehooks-ts";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";
import { PrimaryButton } from "app/components/Styled/button";

interface Props {
  data: any[];
  stats: any[];
  datasetId: string;
  dataTotalCount: number;
  dataTypes: never[];
  canDatasetEditDelete?: boolean;
  datasetDetails: DatasetListItemAPIModel;
}

export default function FinishedFragment(props: Props) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth0();
  const isSmallScreen = useMediaQuery("(max-width:767px)"); //at this breakpoint, we limit user creation abilities
  const queryParams = new URLSearchParams(location.search);
  const storyPage = queryParams.get("page") as string;
  const fromHome = location.search.includes("fromHome=true");
  let redirectPath = `/dataset/${props.datasetId}${
    fromHome ? "?fromHome=true" : ""
  }`;
  if (storyPage) {
    redirectPath += `?fromstory=true&page=${storyPage}`;
  }
  const setDatasetId = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

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

  function handleCreateNewChart() {
    setDatasetId(props.datasetId);
  }

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

  const modifiedSourceUrl = () => {
    const url = props.datasetDetails?.sourceUrl;
    if (!url) {
      return "";
    }
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    } else {
      return `https://${url}`;
    }
  };

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
        `}
      >
        <div
          css={`
            color: #231d2c;
            font-size: 16px;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            line-height: 24px;
            margin-top: 32px;
            @media (max-width: 450px) {
              display: none;
            }
          `}
        >
          {props.datasetDetails.description}
        </div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 12px;
            justify-content: space-between;
            margin-top: 10px;
          `}
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
                position: relative;
              `}
              onMouseOver={() => setOpenFullScreenTooltip(true)}
              onMouseLeave={() => setOpenFullScreenTooltip(false)}
              onClick={handleFullScreenDisplay}
              data-cy="dataset-full-screen-btn"
            >
              <FullScreenIcon width={32} height={32} />
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
                hidden={!openFullScreenTooltip}
              >
                Full Screen
              </div>
            </div>

            <p
              css={`
                font-size: 14px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                padding: 0;
                margin: 0;
                @media (max-width: 450px) {
                  font-size: 12px;
                }
              `}
            >
              {props.dataTotalCount} rows &{" "}
              {Object.keys(props.data[0] || {}).length} columns
            </p>
          </div>
          {isSmallScreen ? (
            <></>
          ) : (
            <>
              {!isAuthenticated ? (
                <Link
                  to="/onboarding/signin"
                  css={`
                    color: #fff;
                    width: 100%;
                    width: max-content;
                    height: 48px;
                    padding: 0 24px;
                    font-size: 14px;
                    background: #6061e5;
                    border-radius: 12px;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    :hover {
                      opacity: 0.8;
                      cursor: pointer;
                    }
                  `}
                >
                  Sign in to Create Chart
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: `/chart/new/chart-type`,
                    search: `?loadataset=true${
                      storyPage ? `&fromstory=true&page=${storyPage}` : ""
                    }`,
                  }}
                >
                  <PrimaryButton
                    size="big"
                    bg="dark"
                    type="button"
                    onClick={handleCreateNewChart}
                  >
                    create chart
                  </PrimaryButton>
                </Link>
              )}
            </>
          )}
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
            fullScreen
          />
        </div>
      </div>
      <div
        css={`
          height: 32px;
        `}
      />
      <div
        css={`
          color: #70777e;
          p {
            margin-bottom: 8px;
            margin-top: 0;
            font-size: 14px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            > a {
              text-decoration: none;
              color: inherit;
              border-bottom: 1px solid #70777e;
            }
          }
          @media (max-width: 500px) {
            display: none;
          }
        `}
      >
        <p>Data Title : {props.datasetDetails.name}</p>
        <p>Data Description : {props.datasetDetails.description}</p>
        <p>Data Category : {props.datasetDetails.category}</p>
        <p>Data Source : {props.datasetDetails.source}</p>
        <p>
          Link to data source:{" "}
          {props.datasetDetails.sourceUrl ? (
            <a
              href={modifiedSourceUrl()}
              rel="noreferrer noopener"
              target="_blank"
            >
              {props.datasetDetails.sourceUrl}
            </a>
          ) : (
            "NIL"
          )}
        </p>
      </div>
      <div css={mobileDescriptioncss}>
        <div>
          <p>Data Title</p>
          <p>{props.datasetDetails.name}</p>
        </div>
        <div>
          <p>Data Description</p>
          <p>{props.datasetDetails.description}</p>
        </div>
        <div>
          <p>Category</p>
          <p>{props.datasetDetails.category}</p>
        </div>
        <div>
          <p>Data Source</p>
          <p> {props.datasetDetails.source}</p>
        </div>
        <div>
          <p>Link to Data Source</p>
          <p>
            {props.datasetDetails.sourceUrl ? (
              <a
                href={modifiedSourceUrl()}
                rel="noreferrer noopener"
                target="_blank"
              >
                {props.datasetDetails.sourceUrl}
              </a>
            ) : (
              "NIL"
            )}
          </p>
        </div>
      </div>
      <div
        css={`
          display: none;
          @media (max-width: 500px) {
            display: block;
            height: 24px;
          }
        `}
      />
      <div css={mobileDescriptioncss}>
        <div>
          <p>Published date</p>
          <p>{moment(props.datasetDetails.createdDate).format("MMMM YYYY")}</p>
        </div>
        <div>
          <p>Last edit time</p>
          <p>{moment(props.datasetDetails.createdDate).format("MMMM YYYY")}</p>
        </div>
      </div>

      <div
        css={`
          height: 32px;
        `}
      />
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
