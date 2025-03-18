/* third-party */
import React from "react";
import find from "lodash/find";
import { useStoreState } from "app/state/store/hooks";
/* project */
import {
  echartTypes,
  ChartTypeModel,
} from "app/modules/chart-module/routes/chart-type/data";
import ToolboxSubHeader from "app/modules/chart-module/components/toolbox/steps/sub-header";
import { ReactComponent as InfoIcon } from "app/modules/chart-module/assets/info-icon.svg";
import { ReactComponent as DateIcon } from "app/modules/chart-module/assets/dateIcon.svg";
import { ReactComponent as NumberIcon } from "app/modules/chart-module/assets/numberIcon.svg";
import { ReactComponent as StringIcon } from "app/modules/chart-module/assets/stringIcon.svg";
import { Box, Grid } from "@material-ui/core";
import {
  echartsBarchart,
  echartsGeomap,
  echartsLinechart,
  echartsAreatimeaxis,
  echartsAreastack,
  echartsSankey,
  echartsTreemap,
  bigNumber,
  echartsSunburst,
  echartsForcegraph,
  echartsCirculargraph,
  echartsCirclepacking,
  echartsBubblechart,
  echartsMultisetBarchart,
  echartsStackedBarchart,
  echartsScatterchart,
  echartsHeatmap,
  echartsGraphgl,
  echartsRadarchart,
  echartsPiechart,
  // @ts-ignore
} from "@rawgraphs/rawgraphs-charts";

export const charts = {
  echartsBarchart,
  echartsGeomap,
  echartsLinechart,
  echartsAreatimeaxis,
  echartsAreastack,
  echartsSankey,
  echartsTreemap,
  bigNumber,
  echartsSunburst,
  echartsForcegraph,
  echartsCirculargraph,
  echartsCirclepacking,
  echartsBubblechart,
  echartsMultisetBarchart,
  echartsStackedBarchart,
  echartsScatterchart,
  echartsHeatmap,
  echartsGraphgl,
  echartsRadarchart,
  echartsPiechart,
};

export function ChartToolBoxChartType() {
  const chartType = useStoreState((state) => state.charts.chartType.value);

  const fChartType = React.useMemo(() => {
    return find(
      echartTypes(false),
      (ct: ChartTypeModel) => ct.id === chartType
    );
  }, [chartType]);

  const echart: any = React.useMemo(() => {
    return charts[chartType as keyof typeof charts];
  }, [chartType]);

  const typeIcon = {
    string: <StringIcon />,
    number: <NumberIcon />,
    date: <DateIcon />,
  };

  return (
    <>
      <ToolboxSubHeader
        name="Chart type"
        level={2}
        tooltip="Please select a suitable chart type for your data or let the AI Agent assist you in making a choice."
      />

      <div
        css={`
          margin: 16px 24px;
          overflow-y: auto;
          max-height: calc(100vh - 320px);
        `}
      >
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: ${chartType && fChartType ? "flex-start" : "center"};
            justify-content: ${chartType && fChartType
              ? "flex-start"
              : "center"};
          `}
        >
          {!chartType && (
            <div
              css={`
                color: #262c34;
                font-size: 14px;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                background: #dfe3e5;
                height: 349px;
                width: 100%;
                border-radius: 12px;
                justify-content: center;
                align-items: center;
                display: flex;
              `}
            >
              <b>Please select a chart type</b>
            </div>
          )}
          {chartType && fChartType && (
            <div
              css={`
                background: #dfe3e5;
                width: 100%;
                padding: 8px 16px;
                border-radius: 12px;
                color: #231d2c;
              `}
              data-cy="chart-type-preview"
            >
              <div
                css={`
                  display: flex;
                  user-select: none;
                  flex-direction: row;
                  align-items: center;
                  gap: 16px;
                `}
              >
                {fChartType.icon}
                <div
                  css={`
                    display: flex;
                    flex-direction: column;
                  `}
                >
                  <p
                    css={`
                      font-size: 14px;
                      margin: 0px;
                      line-height: 20px;
                      font-family: "GothamNarrow-Bold", "Helvetica Neue",
                        sans-serif;
                    `}
                  >
                    {fChartType.label}
                  </p>

                  <p
                    css={`
                      font-size: 12px;
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif;
                      margin: 0px;
                      line-height: normal;
                    `}
                  >
                    {fChartType.categories.join(", ")}
                  </p>
                </div>
              </div>

              <>
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 16px 0px;
                  `}
                >
                  {fChartType.preview}
                </div>

                <p
                  css={`
                    font-family: "GothamNarrow-Book", "Helvetica Neue",
                      sans-serif;
                    font-size: 10px;
                    line-height: normal;
                    color: #231d2c;
                    font-style: normal;
                    margin: 0;
                  `}
                >
                  {fChartType.description}
                </p>
              </>
            </div>
          )}
        </div>

        {chartType && fChartType && echart && (
          <div
            css={`
              display: grid;
              margin-top: 16px;
              gap: 16px;
              grid-template-columns: 1fr 1fr;
              h6 {
                margin: 0;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 12px;
                line-height: normal;
              }
              p {
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                line-height: normal;
              }
            `}
          >
            <div
              css={`
                border-radius: 12px;
                background: #dfe3e5;
                padding: 16px;
                height: 100%;
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                `}
              >
                <h6>Input</h6>
                <InfoIcon />
              </div>

              <div
                css={`
                  margin-top: 16px;
                  display: flex;
                  flex-direction: column;
                  gap: 12px;
                `}
              >
                {echart?.dimensions?.map((d: any) => (
                  <div key={d.id}>
                    <div
                      css={`
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      `}
                    >
                      <p
                        css={`
                          font-size: 10px;
                          margin: 0;
                        `}
                      >
                        {d.name}
                        <span
                          css={`
                            color: #ef1320;
                          `}
                        >
                          *
                        </span>
                      </p>

                      <div
                        css={`
                          background: #ffffff;
                          border-radius: 16px;
                          display: flex;
                          padding: 2px 6px;
                        `}
                      >
                        {d.validTypes.map((t: any) => (
                          <>{typeIcon[t as keyof typeof typeIcon]}</>
                        ))}
                      </div>
                    </div>

                    <p
                      css={`
                        font-size: 8px;
                        margin: 0;
                        margin-top: 4px;
                      `}
                    >
                      {d.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              css={`
                border-radius: 12px;
                background: #dfe3e5;
                padding: 16px;
                height: 100%;
              `}
            >
              <h6>Suitable for</h6>

              <div
                css={`
                  margin-top: 16px;
                `}
              >
                {echart?.metadata?.suitableFor?.map((s: any) => (
                  <div
                    css={`
                      display: flex;
                      gap: 8px;
                      align-items: flex-start;
                    `}
                  >
                    <div
                      css={`
                        width: 3px;
                        height: 3px;
                        background: #000;
                        border-radius: 50%;
                        flex-shrink: 0;
                        margin-top: 5px;
                      `}
                    />
                    <p
                      css={`
                        font-size: 10px;
                        margin: 0;
                      `}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
