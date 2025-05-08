import React from "react";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { useStoreState } from "app/state/store/hooks";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { getDatasetDetailsSource } from "app/modules/chart-module/util/getDatasetDetailsSource";
const ChartArea: React.FC<
  React.PropsWithChildren<{
    hideChartSourceAndTitle?: boolean;
    chartId?: string;
    datasetDetails?: DatasetListItemAPIModel;
    chartName?: string;
    footer?: boolean;
    hideMobileContainer?: boolean;
  }>
> = (props) => {
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );

  const { sourceUrl, filename } = getDatasetDetailsSource(
    datasetDetails,
    props.datasetDetails
  );

  return (
    <div css={commonStyles.container}>
      <div
        css={`
          ${commonStyles.innercontainer}
          ${props.footer ? `min-height: calc(100vh - 100px - 64px);` : ""}
        `}
      >
        <div
          css={`
            width: 100%;
            height: calc(100vh - 140px ${props.footer ? "- 104px" : "- 90px"});
            display: flex;
            flex-direction: column;
            gap: 16px;
            overflow: hidden;
            @media (max-width: 500px) {
              ${props.hideMobileContainer
                ? ""
                : `
              height: max-content;
              border-radius: 10px;
              background: #fff;
              padding: 24px 16px;
              box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.1);
              margin-bottom: 24px;
              `}
            }
          `}
        >
          <p
            css={`
              font-size: 24px;
              margin: 0;
              font-family: "GothamNarrow-Bold", sans-serif;
              color: #231d2c;
              line-height: normal;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 100%;
              display: ${props.hideChartSourceAndTitle ? "none" : "block"};
            `}
          >
            {props.chartName}
          </p>
          <div
            css={`
              width: 100%;
              // screen - header&padding - mappingmessage - title&source - gaps
              height: calc(
                100vh - 140px ${props.footer ? "- 104px" : "- 90px"}
                  ${props.hideChartSourceAndTitle ? "" : "- 43.5px"} - 32px
              );
              @media (max-width: 500px) {
                height: 500px;
              }
            `}
          >
            {props.children}
          </div>

          <p
            id={`datasource-${props.chartId || "1"}`}
            css={`
              color: #70777e;
              font-family: "GothamNarrow-Bold", sans-serif;
              font-size: 12px;
              margin: 0;
              display: ${props.hideChartSourceAndTitle ? "none" : "block"};
              line-height: normal;
              a {
                font-family: "GothamNarrow-Bold", sans-serif;

                color: #70777e;
                text-decoration: underline;
                border-bottom: 1px solid #70777e;
                margin: 0;
              }
            `}
          >
            Data source:{" "}
            <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
              {props.datasetDetails?.source ?? datasetDetails.source}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChartArea;
