import React from "react";
import { useStoreState } from "@app/state/store/hooks";
import { styles as commonStyles } from "@app/modules/chart-module/routes/common/styles";
import GeomapChartPlaceholderImage from "@app/modules/chart-module/assets/geomapPlaceholder.svg?react";
import LinechartPlaceholderImage from "@app/modules/chart-module/assets/lineChartPlaceholder.svg?react";
import BigNumberPlaceholderImage from "@app/modules/chart-module/assets/bigNumberPlaceholder.svg?react";
import BarChartPlaceholderImage from "@app/modules/chart-module/assets/barChartPlaceholder.svg?react";
import SankeyPlaceholderImage from "@app/modules/chart-module/assets/sankeyPlaceholder.svg?react";
import TreemapPlaceholderImage from "@app/modules/chart-module/assets/treemapPlaceholder.svg?react";
import SunburstPlaceholderImage from "@app/modules/chart-module/assets/sunburstPlaceholder.svg?react";
import PieChartPlaceholderImage from "@app/modules/chart-module/assets/pieChartPlaceholder.svg?react";
import CirclepackingPlaceholderImage from "@app/modules/chart-module/assets/circlepackingPlaceholder.svg?react";
import ForcegraphPlaceholderImage from "@app/modules/chart-module/assets/forcegraphPlaceholder.svg?react";
import CirculargraphPlaceholderImage from "@app/modules/chart-module/assets/circulargraphPlaceholder.svg?react";
import RadarChartPlaceholderImage from "@app/modules/chart-module/assets/radarChartPlaceholder.svg?react";
import ScatterChartPlaceholderImage from "@app/modules/chart-module/assets/scatterChartPlaceholder.svg?react";
import GraphglPlaceholderImage from "@app/modules/chart-module/assets/graphglPlaceholder.svg?react";
import HeatmapPlaceholderImage from "@app/modules/chart-module/assets/heatmapPlaceholder.svg?react";
import AreatimeaxisPlaceholderImage from "@app/modules/chart-module/assets/areatimeaxisPlaceholder.svg?react";
import AreastackedPlaceholderImage from "@app/modules/chart-module/assets/areastackedPlaceholder.svg?react";
import { CHART_DEFAULT_HEIGHT } from "@app/modules/chart-module/data";

export default function ChartPlaceholder(props: { loading?: boolean }) {
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const activePanels = useStoreState(
    (state) => state.charts.activePanels.value
  );

  const chartPlaceholders = [
    {
      id: "echartsBarchart",
      placeholder: <BarChartPlaceholderImage />,
    },
    {
      id: "echartsMultisetBarchart",
      placeholder: <BarChartPlaceholderImage />,
    },
    {
      id: "echartsStackedBarchart",
      placeholder: <BarChartPlaceholderImage />,
    },
    {
      id: "echartsGeomap",
      placeholder: <GeomapChartPlaceholderImage />,
    },
    {
      id: "echartsLinechart",
      placeholder: <BarChartPlaceholderImage />,
    },
    {
      id: "echartsSankey",
      placeholder: <SankeyPlaceholderImage />,
    },
    {
      id: "echartsTreemap",
      placeholder: <TreemapPlaceholderImage />,
    },
    {
      id: "bigNumber",
      placeholder: (
        <div
          css={`
            width: 100%;
            height: 100%;
            svg {
              width: 316px !important;
              height: 288px !important;

          `}
        >
          <BigNumberPlaceholderImage />
        </div>
      ),
    },
    {
      id: "echartsSunburst",
      placeholder: <SunburstPlaceholderImage />,
    },
    {
      id: "echartsPiechart",
      placeholder: <PieChartPlaceholderImage />,
    },
    {
      id: "echartsCirclepacking",
      placeholder: <CirclepackingPlaceholderImage />,
    },
    {
      id: "echartsForcegraph",
      placeholder: <ForcegraphPlaceholderImage />,
    },
    {
      id: "echartsCirculargraph",
      placeholder: <CirculargraphPlaceholderImage />,
    },

    {
      id: "echartsBubblechart",
      placeholder: <AreastackedPlaceholderImage />,
    },
    {
      id: "echartsScatterchart",
      placeholder: <ScatterChartPlaceholderImage />,
    },
    {
      id: "echartsHeatmap",
      placeholder: <HeatmapPlaceholderImage />,
    },
    {
      id: "echartsAreatimeaxis",
      placeholder: <AreatimeaxisPlaceholderImage />,
    },
    {
      id: "echartsGraphgl",
      placeholder: <GraphglPlaceholderImage />,
    },
    {
      id: "echartsRadarchart",
      placeholder: <RadarChartPlaceholderImage />,
    },
    {
      id: "echartsAreastack",
      placeholder: <AreastackedPlaceholderImage />,
    },
  ];

  const getChartPlaceholder = () => {
    const placeholder = chartPlaceholders.find(
      (chartPlaceholder) => chartPlaceholder.id === chartType
    );
    return placeholder?.placeholder;
  };

  const displayPlaceholder = () => {
    if (activePanels !== "mapping") {
      return;
    }
    return (
      <div
        css={`
          position: relative;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          svg {
            width: 100%;
            height: 100%;
          }
        `}
      >
        {!props.loading && <>{getChartPlaceholder()}</>}
      </div>
    );
  };

  return (
    <div
      css={`
        ${commonStyles.container};
      `}
    >
      {displayPlaceholder()}
    </div>
  );
}
