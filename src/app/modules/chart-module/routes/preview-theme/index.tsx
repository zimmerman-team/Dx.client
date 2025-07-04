/* third-party */
import React from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import useTitle from "react-use/lib/useTitle";
import { useHistory, useParams } from "react-router-dom";
import Skeleton from "@material-ui/lab/Skeleton";
/* project */
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { useDataThemesEchart } from "app/hooks/useDataThemesEchart";
import { ChartBuilderPreviewThemeProps } from "app/modules/chart-module/routes/preview-theme/data";
import WarningDialog from "app/modules/chart-module/components/dialog/warningDialog";
import GeomapLegend from "app/modules/chart-module/components/geomap-legend";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { getDatasetDetailsSource } from "app/modules/chart-module/util/getDatasetDetailsSource";
import { mobileDescriptioncss } from "app/modules/dataset-module/routes/upload-module/style";
import moment from "moment";
import AIIcon from "app/assets/icons/AIIcon";
import ChartArea from "app/modules/chart-module/components/chart-area";
import { MOBILE_BREAKPOINT } from "app/theme";

export function ChartBuilderPreviewTheme(props: ChartBuilderPreviewThemeProps) {
  useTitle("Dataxplorer - Preview Chart");
  const { visualOptions } = props;
  const token = useStoreState((state) => state.AuthToken.value);
  const domRef = React.useRef<HTMLDivElement>(null);
  const { page } = useParams<{ page: string; view: string }>();
  const dataset = useStoreState((state) => state.charts.dataset.value);
  const history = useHistory();
  const { render } = useDataThemesEchart({ readOnly: true });
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const selectedChartType = useStoreState(
    (state) => state.charts.chartType.value
  );
  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  const { sourceUrl, filename } = getDatasetDetailsSource(
    datasetDetails,
    undefined
  );
  React.useEffect(() => {
    if (token) {
      loadDataset({
        token,
        getId: dataset as string,
      });
    } else {
      loadDataset({
        token,
        getId: dataset as string,
        nonAuthCall: !token,
      });
    }
  }, [token, dataset]);
  React.useEffect(() => {
    //if dataset is empty and not loading, redirect to data page
    //doing this for only new chart because existing chart will have data (gotten from page id)
    if (dataset === null && !props.loading && page === "new") {
      history.push(`/chart/${page}/data`);
    }
  }, [dataset]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  React.useEffect(() => {
    if (
      domRef &&
      domRef.current &&
      !isEmpty(mapping) &&
      !isEmpty(visualOptions)
    ) {
      const loader = document.getElementById("chart-placeholder");
      if (loader) {
        loader.style.display = "flex";
      }
      try {
        if (loader) {
          loader.style.display = "none";
        }
        render(
          props.renderedChartMappedData,
          // @ts-ignore
          domRef.current,
          selectedChartType ?? "echartsBarchart",
          {
            ...visualOptions,
            width: domRef.current.clientWidth,
            height: domRef.current.clientHeight,
          },
          mapping,
          "common-chart-render-container"
        );
      } catch (e) {
        if (process.env.NODE_ENV === "development") {
          console.log("chart error", e);
        }

        if (loader) {
          loader.style.display = "none";
        }
      }
    }
  }, [
    mapping,
    visualOptions,
    props.renderedChart,
    props.renderedChartMappedData,
  ]);

  React.useEffect(() => {
    props.setIsPreviewView(true);
    return () => {
      props.setIsPreviewView(false);
    };
  }, []);

  const handleVizClick = () => {
    if (page === "new" || props.editable) {
      history.push(`/chart/${page}/customize`);
    }
  };

  if (props.dataError || props.chartError) {
    return (
      <>
        <ErrorComponent
          chartErrorMessage={props.chartErrorMessage}
          dataError={props.dataError}
          chartError={props.chartError}
          page={page}
        />
      </>
    );
  }

  return (
    <>
      <ChartArea chartName={props?.loadedChart?.name} footer>
        {!props.isMappingValid ? (
          <WarningDialog isMappingValid={props.isMappingValid} />
        ) : (
          <>
            <div
              id="chart-placeholder"
              css={`
                display: flex;
                padding: 0 24px;
                margin-top: 20px;
                align-items: center;
                align-self: flex-start;
                justify-content: center;
                height: 100%;
                width: 100%;

                @media (max-width: 1280px) {
                  width: calc(100vw - 400px);
                }

                .MuiSkeleton-wave::after {
                  background: linear-gradient(
                    90deg,
                    transparent,
                    rgba(223, 227, 230, 1),
                    transparent
                  );
                }

                .MuiSkeleton-root {
                  background: transparent;
                }
              `}
            >
              <Skeleton
                animation="wave"
                variant="rect"
                width="100%"
                height="100%"
              />
            </div>
            <>
              <div
                css={`
                  width: 100%;
                  height: 100%;
                `}
              >
                <div
                  ref={props.containerRef}
                  css={`
                    position: relative;
                    width: 100%;
                    height: 100%;
                  `}
                >
                  <div
                    ref={domRef}
                    onClick={handleVizClick}
                    id="common-chart-render-container"
                    css={`
                      height: 100%;
                      width: 100%;
                      ${selectedChartType === "bigNumber" &&
                      window.location.pathname.indexOf("/chart/") > -1 &&
                      `
                    > div {
                      width: 135px; 
                    }
                `}
                      * {
                        font-family: "GothamNarrow-Book", "Helvetica Neue",
                          sans-serif !important;
                      }
                    `}
                  />
                  <div
                    css={`
                      position: absolute;
                      right: -0.6%;
                      top: -4%;
                      display: ${!props.isAIAssistedChart || props.loading
                        ? "none"
                        : "block"};
                    `}
                  >
                    <AIIcon />
                  </div>
                  {selectedChartType === "echartsGeomap" &&
                  props.visualOptions?.showLegend ? (
                    <div
                      css={`
                        position: absolute;
                        bottom: 0;
                        right: 0;
                      `}
                    >
                      <GeomapLegend
                        data={props.renderedChartMappedData}
                        visualOptions={props.visualOptions}
                        mapping={mapping}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </>
          </>
        )}
      </ChartArea>

      <div css={mobileDescriptioncss}>
        <div>
          <p>Published date</p>
          <p>{moment(datasetDetails.createdDate).format("MMMM YYYY")}</p>
        </div>
        <div>
          <p>Last edit time</p>
          <p>{moment(datasetDetails.createdDate).format("MMMM YYYY")}</p>
        </div>
      </div>
      <div
        css={`
          display: none;
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            display: block;
            height: 24px;
          }
        `}
      />
    </>
  );
}
