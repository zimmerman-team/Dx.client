/* third-party */
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { isEmpty } from "lodash";
import { Slide, Tooltip, useMediaQuery } from "@material-ui/core";
/* project */
import {
  snackbarStyle,
  styles,
} from "app/modules/chart-module/components/toolbox/styles";
import { ChartExporter } from "app/modules/chart-module/components/exporter";
import {
  ChartToolBoxProps,
  ToolboxNavType,
} from "app/modules/chart-module/components/toolbox/data";
import { ChartToolBoxSteps } from "app/modules/chart-module/components/toolbox/steps";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import {
  emptyChartAPI,
  ChartAPIModel,
  chartViews,
} from "app/modules/chart-module/data";
import ToolboxNav from "app/modules/chart-module/components/toolbox/steps/navbar";
import { InfoSnackbar } from "app/modules/chart-module/components/chartSubheaderToolbar/infoSnackbar";
import { PrimaryButton } from "app/components/Styled/button";
import useTogglePanelWithKey from "app/hooks/useTogglePanelWithKey";

export function ChartModuleToolBox(props: Readonly<ChartToolBoxProps>) {
  const { page, view } = useParams<{ page: string; view?: string }>();
  const isValidView = Object.values(chartViews).find((v) => v === view);
  const history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isClickable, setIsClickable] = React.useState(false);

  const location = useLocation();

  const dataset = useStoreState((state) => state.charts.dataset.value);

  const activePanels = useStoreState(
    (state) => state.charts.activePanels.value
  );

  const setActivePanels = useStoreActions(
    (state) => state.charts.activePanels.setValue
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  const [showSnackbar, setShowSnackbar] = React.useState<string | null>(null);
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const [displayToolbar, setDisplayToolbar] = React.useState<"block" | "none">(
    "block"
  );
  useTogglePanelWithKey({
    openToolbox: props.openToolbox,
    setToolboxOpen: props.setToolboxOpen,
  });

  const stepPaths = [
    { name: "dataset", path: `/chart/${page}/data` },
    { name: "dataset", path: `/chart/${page}/preview-data` },
    { name: "chart", path: `/chart/${page}/chart-type` },
    { name: "mapping", path: `/chart/${page}/mapping` },
    { name: "filters", path: `/chart/${page}/filters` },
    { name: "customize", path: `/chart/${page}/customize` },
  ];

  const onNavBtnClick = (name: ToolboxNavType, path: string) => {
    if (
      name === "dataset" ||
      name === "selectDataset" ||
      name === "chart" ||
      name === "mapping"
    ) {
      if (name === "dataset" && !isEmpty(dataset)) {
        history.push(`/chart/${page}/preview-data`);
        return;
      }
      if (name === "chart" && !isEmpty(dataset)) {
        history.push(`/chart/${page}/chart-type`);
        return;
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        if (page === "new") {
          props.triggerAutoSave();
        } else {
          history.push(`/chart/${page}/mapping`);
        }
        return;
      }
    } else if (!isEmpty(props.mappedData)) {
      history.push(path);
    }
  };

  React.useEffect(() => {
    const step = stepPaths.find(
      (step) => step.path === location.pathname
    )?.name;

    setActivePanels(step as ToolboxNavType);
  }, [location.pathname]);

  const onMouseOverNavBtn = (name: ToolboxNavType) => {
    //handles state to set cursor types for nav buttons
    if (
      name === "dataset" ||
      name === "selectDataset" ||
      name === "chart" ||
      name === "mapping"
    ) {
      if (name === "dataset") {
        setIsClickable(true);
      }
      if (name === "chart" && !isEmpty(dataset)) {
        setIsClickable(true);
      }
      if (name === "mapping" && !isEmpty(dataset) && !isEmpty(chartType)) {
        setIsClickable(true);
      }
    } else if (!isEmpty(props.mappedData)) {
      setIsClickable(true);
    }
  };

  React.useEffect(() => {
    if (
      location.pathname === `/chart/${page}` ||
      view === "preview" ||
      !isValidView
    ) {
      setDisplayToolbar("none");
      props.setToolboxOpen(false);
    } else {
      setDisplayToolbar("block");
      props.setToolboxOpen(true);
    }
  }, [location.pathname]);

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  if (!canChartEditDelete && page !== "new") {
    return null;
  }

  return (
    <>
      <Slide
        direction="left"
        in={props.openToolbox}
        style={{ visibility: "visible", display: displayToolbar }}
      >
        <div css={styles.container}>
          {!isMobile && (
            <Tooltip
              title={
                <>
                  Press <b>P</b> to quickly open/close the panel
                </>
              }
              placement="right"
            >
              <div
                role="button"
                tabIndex={-1}
                css={`
                  top: calc((100% - 205px) / 2);
                  left: -16px;
                  color: #fff;
                  width: 16px;
                  height: 133px;
                  display: flex;
                  cursor: pointer;
                  position: absolute;
                  background: #231d2c;
                  align-items: center;
                  flex-direction: column;
                  justify-content: center;
                  border-radius: 10px 0px 0px 10px;
                  transition: background 0.2s ease-in-out;
                  &:hover {
                    background: #13183f;
                  }
                  > svg {
                    transform: rotate(${!props.openToolbox ? "-" : ""}90deg);
                    > path {
                      fill: #fff;
                    }
                  }
                `}
                onClick={() => {
                  if (props.openToolbox) {
                    props.setToolboxOpen(false);
                  } else {
                    props.setToolboxOpen(true);
                  }
                }}
              >
                <TriangleXSIcon />
              </div>
            </Tooltip>
          )}

          <ToolboxNav
            stepPaths={stepPaths}
            onNavBtnClick={onNavBtnClick}
            isClickable={isClickable}
            setIsClickable={setIsClickable}
            onMouseOverNavBtn={onMouseOverNavBtn}
          />
          {props.dataSteps && (
            <ChartToolBoxSteps
              data={props.data}
              rawViz={props.rawViz}
              loading={props.loading}
              dataTypes={props.dataTypes}
              openPanel={props.openPanel}
              mappedData={props.mappedData}
              loadDataset={props.loadDataset}
              visualOptions={props.visualOptions}
              setVisualOptions={props.setVisualOptions}
              filterOptionGroups={props.filterOptionGroups}
              save={props.onSave}
              dimensions={props.dimensions}
              activeStep={activePanels}
              onNavBtnClick={onNavBtnClick}
              stepPaths={stepPaths}
              isClickable={isClickable}
              setIsClickable={setIsClickable}
              onMouseOverNavBtn={onMouseOverNavBtn}
              setChartFromAPI={props.setChartFromAPI}
              deselectDataset={props.deselectDataset}
              setShowSnackbar={setShowSnackbar}
            />
          )}

          {props.exportView && props.rawViz && (
            <div css={styles.exportview}>
              <ChartExporter rawViz={props.rawViz} />
            </div>
          )}
        </div>
      </Slide>
      <InfoSnackbar
        gap={location.pathname.includes("story")}
        data-testid="create-chart-snackbar"
        onClose={() => setShowSnackbar(null)}
        open={showSnackbar !== null && showSnackbar !== ""}
      >
        <div css={snackbarStyle}>
          <p>
            Your chart has been successfully saved! You can now find it in your
            library.
          </p>
          <div>
            <PrimaryButton
              size="big"
              bg="light"
              onClick={() => {
                setShowSnackbar(null);
                history.push("/story/new/initial");
              }}
            >
              Create story
            </PrimaryButton>

            <PrimaryButton
              size="big"
              bg="dark"
              onClick={() => {
                setShowSnackbar(null);
                history.push("/");
              }}
            >
              Back to dashboard
            </PrimaryButton>
          </div>
        </div>
      </InfoSnackbar>
    </>
  );
}
