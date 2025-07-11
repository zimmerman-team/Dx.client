import React from "react";
import maxBy from "lodash/maxBy";
import isEqual from "lodash/isEqual";
import { useDataThemesEchart } from "app/hooks/useDataThemesEchart";
import { formatFinancialValue } from "app/utils/formatFinancialValue";

interface ChartRepresentationProps {
  data: any;
  containerId: string;
}

export const ProgressBar = (props: { progress: string; label: string }) => {
  return (
    <div
      css={`
        width: 100%;
        min-width: 171px;
      `}
    >
      <div
        css={`
          width: 100%;
          display: flex;
          color: #262c34;
          margin-bottom: 4px;
          justify-content: space-between;

          > p {
            margin: 0;
          }
        `}
      >
        <p
          css={`
            overflow: clip;
            max-width: 150px;
            white-space: nowrap;
            text-overflow: ellipsis;
          `}
        >
          {props.label}
        </p>
        <p>{parseFloat(props.progress).toFixed(2).replace(".00", "")}%</p>
      </div>
      <div
        css={`
          width: 100%;
          height: 5px;
          background: #d9d9d9;
          border-radius: 50px;
        `}
      >
        <div
          css={`
            background: #000000;
            border-radius: 50px;
            height: 100%;
            width: ${props.progress};
          `}
        />
      </div>
    </div>
  );
};

export const BarChartRepresentation = (props: ChartRepresentationProps) => {
  const { render } = useDataThemesEchart({ readOnly: true });
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (domRef && domRef.current) {
      try {
        const max = maxBy(props.data, "value");
        render(
          props.data.map((item: any) => ({
            bars: item.name,
            size: item.value,
          })),
          // @ts-ignore
          domRef.current,
          "echartsBarchart",
          {
            width: 200,
            height: 140,
            // removed barwidth here to make it adaptable to the container
            marginBottom: 20,
            marginTop: 20,
            showXAxis: true,
            barColor: "#000000",
            splitLineY: false,
            showTooltip: true,
            realTimeSort: false,
            xAxisLabelFontSize: 10,
            barRadius: [2, 2, 0, 0],
            xAxisLineColor: "#ADB5BD",
            background: "transparent",
            xAxisLabelColor: "#262C34",
            xAxisLabelInterval: (index: number) => {
              return isEqual(props.data[index], max);
            },
          },
          null,
          props.containerId
        );
      } catch (e) {
        while (domRef.current.firstChild) {
          domRef.current.removeChild(domRef.current.firstChild);
        }
        if (process.env.NODE_ENV === "development") {
          console.log("chart error", e);
        }
      }
    }
  }, [props.data]);

  return (
    <div
      id={props.containerId}
      ref={domRef}
      css={`
        width: 200px;
        height: 140px;
      `}
    />
  );
};

export const TotalValues = (props: { value: number }) => {
  return (
    <div
      css={`
        color: #262c34;
        font-size: 12px;
        text-align: center;
      `}
    >
      <p>
        <b>{formatFinancialValue(props.value, true)}</b> unique values
      </p>
    </div>
  );
};
