import React from "react";
import { useStoreState } from "app/state/store/hooks";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ReactComponent as GeomapChartPlaceholderImage } from "app/modules/chart-module/assets/geomapPlaceholder.svg";
import { ReactComponent as LinechartPlaceholderImage } from "app/modules/chart-module/assets/lineChartPlaceholder.svg";
import { ReactComponent as BigNumberPlaceholderImage } from "app/modules/chart-module/assets/bigNumberPlaceholder.svg";
import { ReactComponent as BarChartPlaceholderImage } from "app/modules/chart-module/assets/barChartPlaceholder.svg";
import { ReactComponent as SankeyPlaceholderImage } from "app/modules/chart-module/assets/sankeyPlaceholder.svg";
import { ReactComponent as TreemapPlaceholderImage } from "app/modules/chart-module/assets/treemapPlaceholder.svg";

import { ReactComponent as SunburstPlaceholderImage } from "app/modules/chart-module/assets/sunburstPlaceholder.svg";
import { ReactComponent as PieChartPlaceholderImage } from "app/modules/chart-module/assets/pieChartPlaceholder.svg";
import { ReactComponent as CirclepackingPlaceholderImage } from "app/modules/chart-module/assets/circlepackingPlaceholder.svg";
import { ReactComponent as ForcegraphPlaceholderImage } from "app/modules/chart-module/assets/forcegraphPlaceholder.svg";
import { ReactComponent as CirculargraphPlaceholderImage } from "app/modules/chart-module/assets/circulargraphPlaceholder.svg";
import { ReactComponent as RadarChartPlaceholderImage } from "app/modules/chart-module/assets/radarChartPlaceholder.svg";
import { ReactComponent as ScatterChartPlaceholderImage } from "app/modules/chart-module/assets/scatterChartPlaceholder.svg";
import { ReactComponent as GraphglPlaceholderImage } from "app/modules/chart-module/assets/graphglPlaceholder.svg";
import { ReactComponent as HeatmapPlaceholderImage } from "app/modules/chart-module/assets/heatmapPlaceholder.svg";
import { ReactComponent as AreatimeaxisPlaceholderImage } from "app/modules/chart-module/assets/areatimeaxisPlaceholder.svg";
import { ReactComponent as AreastackedPlaceholderImage } from "app/modules/chart-module/assets/areastackedPlaceholder.svg";
import { CHART_DEFAULT_HEIGHT } from "app/modules/chart-module/data";

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
