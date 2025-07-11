import React from "react";
import get from "lodash/get";
import filter from "lodash/filter";
import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { formatFinancialValue } from "app/utils/formatFinancialValue";
import {
  MapChart,
  BarChart,
  LineChart,
  PieChart,
  SankeyChart,
  TreemapChart,
  SunburstChart,
  CustomChart,
  GraphChart,
  ScatterChart,
  RadarChart,
  HeatmapChart,
} from "echarts/charts";
import {
  GraphGLChart,
  // @ts-ignore
} from "echarts-gl/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  DataZoomComponent,
} from "echarts/components";
import { charts } from "app/modules/chart-module/data";
import { drillDown } from "app/utils/getCirclePackingOption";
import { checkLists } from "app/modules/chart-module/routes/customize/data";
//@ts-ignore
import { transform } from "echarts-stat";
import { useSetRecoilState } from "recoil";
import { chartsRenderedAtom } from "app/state/recoil/atoms";
import { debounce } from "lodash";

echarts.use([
  BarChart,
  MapChart,
  PieChart,
  LineChart,
  GraphChart,
  CustomChart,
  SankeyChart,
  HeatmapChart,
  RadarChart,
  TreemapChart,
  GraphGLChart,
  GridComponent,
  SunburstChart,
  ScatterChart,
  CanvasRenderer,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  VisualMapComponent,
]);

interface UseDataThemesEchartProps {
  readOnly?: boolean;
  setVisualOptions?: (value: any) => void;
  visualOptions?: any;
}

export function useDataThemesEchart({
  visualOptions: mainVisualOptions,
  setVisualOptions,
  readOnly,
}: UseDataThemesEchartProps) {
  const setChartsRendered = useSetRecoilState(chartsRenderedAtom);

  const debouncedSetVisualOptions = debounce((value: any) => {
    if (setVisualOptions) {
      setVisualOptions(value);
    }
  }, 500);

  function onResize(chart: echarts.EChartsType, id: string, height?: number) {
    const container = document.getElementById(id);
    chart.resize({
      width: container?.clientWidth,
      height: height ?? "auto",
    });
  }
  echarts.registerTransform(transform.regression);
  const valueFormatter3 = (params: any, isMonetaryValue: boolean) => {
    return `${params.name}: ${
      isMonetaryValue ? formatFinancialValue(params.value, true) : params.value
    }`;
  };

  function echartsBarchart(data: any, visualOptions: any, mapping: any) {
    const {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      realTimeSort,
      barColor,
      splitLineY,
      barRadius,
      barWidth,
      xAxisLineColor,
      xAxisLabelFontSize,
      autoBarWidth,
      focus,
      xAxisLabelColor,
      xAxisLabelInterval,
      showTooltip,
      isMonetaryValue,
      label,
      dataZoom,
      logarithmicYAxis,
      dataZoomStart,
      dataZoomEnd,
    } = visualOptions;

    const sortedData = sortBy(data, (d) => d.bars);

    const bars = sortedData.map((d: any) => d.bars);
    const sizes = sortedData.map((d: any) => d.size);

    return {
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,
      },
      xAxis: {
        data: bars,
        show: true,
        type: "category",
        axisTick: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: xAxisLineColor,
          },
        },
        axisLabel: {
          show: label,
          color: xAxisLabelColor || "#000",
          fontSize: xAxisLabelFontSize || 12,
          interval: xAxisLabelInterval || "auto",
        },
      },
      yAxis: {
        type: logarithmicYAxis ? "log" : "value",
        show: true,
        splitLine: {
          show: splitLineY ?? true,
        },
        name: mapping?.size?.value?.[0] ?? "",
        nameTextStyle: {
          align: "left",
        },
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 100,
            },
            {
              show: true,
            },
          ]
        : null,
      // xAxis: orientation === "horizontal" ? { type: "value" } : { data: bars },
      // yAxis: orientation === "vertical" ? { type: "value" } : { data: bars },
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          name: "",
          // height,
          type: "bar",
          data: sizes,
          realtimeSort: realTimeSort ?? true,
          itemStyle: {
            color: barColor,
            borderRadius: barRadius,
          },
          emphasis: {
            focus,
          },
          barWidth: autoBarWidth ? undefined : barWidth,
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter3(params, isMonetaryValue),
      },
    };
  }

  function echartsMultisetBarchart(
    data: any,
    visualOptions: any,
    mapping: any
  ) {
    const {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      realTimeSort,
      barRadius,
      barWidth,
      barGap,
      legend,
      showTooltip,
      isMonetaryValue,
      label,
      labelFontSize,
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
      palette,
    } = visualOptions;

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,
      },
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter3(params, isMonetaryValue),
      },
      legend: {
        show: legend,
        data: data.series.map((d: any) => d.name),
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 20,
            },
            {
              show: true,
            },
          ]
        : null,
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          data: data.xAxisValues,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: data.series.map((d: any) => ({
        name: d.name,
        type: "bar",
        realtimeSort: realTimeSort ?? true,
        barGap,
        itemStyle: {
          borderRadius: barRadius,
        },
        label: {
          show: label,
          rotate: 90,
          formatter: "{c}  {name|{a}}",
          fontSize: labelFontSize,
          rich: {
            name: {},
          },
        },
        emphasis: {
          focus: "series",
        },
        data: data.xAxisValues.map((x: any) => d.values[x] || 0),
        barWidth,
      })),
    };
  }

  function echartsStackedBarchart(data: any, visualOptions: any, mapping: any) {
    const {
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      realTimeSort,
      barRadius,
      barWidth,
      legend,
      showTooltip,
      isMonetaryValue,
      label,
      labelFontSize,
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
      palette,
    } = visualOptions;

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,
      },
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          return `${params.name}: ${params.seriesName} - ${
            isMonetaryValue
              ? formatFinancialValue(params.value, true)
              : params.value
          }`;
        },
      },
      legend: {
        show: legend,
        data: data.series.map((d: any) => d.name),
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 20,
            },
            {
              show: true,
            },
          ]
        : null,
      xAxis: [
        {
          type: "category",
          axisTick: { show: false },
          data: data.xAxisValues,
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: data.series.map((d: any) => ({
        name: d.name,
        type: "bar",
        stack: "total",
        realtimeSort: realTimeSort ?? true,
        itemStyle: {
          borderRadius: barRadius,
        },
        label: {
          show: label,
          rotate: 90,
          formatter: (params: any) => {
            return `${
              isMonetaryValue
                ? formatFinancialValue(params.value, true)
                : params.value
            }`;
          },
          fontSize: labelFontSize,
          rich: {
            name: {},
          },
        },
        emphasis: {
          focus: "series",
        },
        data: data.xAxisValues.map((x: any) => d.values[x] || 0),
        barWidth,
      })),
    };
  }

  function echartsPiechart(data: any, visualOptions: any) {
    const {
      // artboard
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      showLegend,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // chart
      drawDonut,
      arcThickness,
      showLabel,
      labelPosition,
      labelFontSize,
      // Palette
      palette,
    } = visualOptions;
    const defaultRadius = 80;

    const thicknessPercent =
      defaultRadius - (arcThickness / 100) * defaultRadius;

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter3(params, isMonetaryValue),
      },
      legend: {
        top: "5%",
        left: "center",
        show: showLegend,
      },
      series: [
        {
          height,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          type: "pie",
          radius: drawDonut
            ? [`${thicknessPercent}%`, `${defaultRadius}%`]
            : ["0%", `${defaultRadius}%`],
          avoidLabelOverlap: false,
          label: {
            show: showLabel ?? true,
            position: labelPosition ?? "outside",
            fontSize: labelFontSize ?? 12,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: "bold",
            },
          },
          data: data,
        },
      ],
    };
  }

  function echartsGeomap(data: any, visualOptions: any) {
    const {
      // artboard
      height,
      width,
      background,
      // chart
      showAntarctica,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      palette,
      roam,
      showTooltip,
      isMonetaryValue,
      scaleLimitMin,
      scaleLimitMax,
    } = visualOptions;

    if (!data.geoJSON) return {};
    let geoJSON = null;
    if (!showAntarctica) {
      geoJSON = {
        ...data.geoJSON,
        features: data.geoJSON.features.filter(
          (feature: any) => feature.id !== "ATA"
        ),
      };
    } else {
      geoJSON = data.geoJSON;
    }

    echarts.registerMap("World", geoJSON);

    const sizes = data.results.map((d: any) => d.value);

    // height to width ratio
    const sizeRatio = showAntarctica ? 0.55 : 0.45;

    const responsiveHeight = sizeRatio * width;
    const responsiveWidth = height * (1 / sizeRatio);

    const newHeight = responsiveHeight > height ? height : responsiveHeight;
    const newWidth = responsiveHeight > height ? responsiveWidth : width;

    const top = height - newHeight > 0 ? (height - newHeight) / 2 : 0;
    const left = width - newWidth > 0 ? (width - newWidth) / 2 : 0;
    return {
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        showDelay: 0,
        transitionDuration: 0.2,
        confine: true,
        formatter: (params: any) => {
          if (params.value) {
            return `${params.name}: ${
              isMonetaryValue
                ? formatFinancialValue(params.value, true)
                : params.value
            }`;
          }
        },
      },
      visualMap: {
        left: "right",
        min: Math.min(...sizes),
        max: Math.max(...sizes),
        inRange: {
          color: checkLists.find((item) => item.label === palette)?.value,
        },
        text: ["High", "Low"],
        calculable: true,
        show: false,
      },
      series: [
        {
          type: "map",
          height: newHeight,
          width: newWidth,
          roam: roam,
          map: "World",
          data: data.results,
          top: marginTop + top,
          left: marginLeft + left,
          right: marginRight,
          bottom: marginBottom,
          scaleLimit: {
            min: scaleLimitMin,
            max: scaleLimitMax,
          },

          emphasis: {
            label: {
              show: false,
            },
            itemStyle: {
              areaColor: "#cdd4df",
            },
          },
          select: {
            disabled: true,
          },
        },
      ],
    };
  }

  const valueFormatter2 = (value: number | string, isMonetaryValue: boolean) =>
    isMonetaryValue
      ? formatFinancialValue(parseInt(value.toString(), 10), true)
      : value;

  function echartsLinechart(data: any, visualOptions: any, mapping: any) {
    const {
      // artboard
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      showLegend,
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
      lineType,
      lineWidth,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      palette,
    } = visualOptions;

    return {
      color:
        checkLists.find((item) => item.label === palette)?.value ??
        checkLists[0].value,
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,

        zlevel: -1,
        z: -1,
      },
      xAxis: {
        type: "category",
        data: data.xAxisValues || [],
        zlevel: -1,
        z: -1,
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        zlevel: -1,
        z: -1,
        nameTextStyle: {
          align: "left",
        },
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 20,
            },
            {
              show: true,
            },
          ]
        : null,
      legend: {
        show: showLegend,
        icon: "roundRect",
      },
      backgroundColor: "transparent",

      series: data.series.map((d: any) => ({
        type: "line",
        name: d.name,
        data: data.xAxisValues.map((x: any) => d.values[x] || 0),
        z: -1,
        zlevel: -1,
        lineStyle: {
          type: lineType,
          width: lineWidth,
        },
      })),
      tooltip: {
        show: showTooltip,
        trigger: "axis",

        confine: true,
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
    };
  }

  function echartsAreatimeaxis(data: any, visualOptions: any, mapping: any) {
    const {
      // artboard
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Palette
      palette,
      // chart options
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
    } = visualOptions;

    const convertedData = sortBy(data, (d) => d.x).map((d: any) => [
      +new Date(d.x),
      d.y,
    ]);

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,

        zlevel: -1,
        z: -1,
      },
      tooltip: {
        trigger: showTooltip ? "axis" : "none",
        position: function (pt: any) {
          return [pt[0], "10%"];
        },
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
      xAxis: {
        type: "time",
        boundaryGap: false,
      },
      yAxis: {
        type: "value",
        boundaryGap: [0, "100%"],
        name: mapping?.y?.value?.[0] ?? "",
        nameTextStyle: {
          align: "left",
        },
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 20,
            },
            {
              show: true,
            },
          ]
        : null,
      series: [
        {
          type: "line",
          smooth: true,
          symbol: "none",
          areaStyle: {},
          data: convertedData,
        },
      ],
    };
  }

  function echartsAreastack(data: any, visualOptions: any, mapping: any) {
    const {
      // artboard
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      lineType,
      lineWidth,
      // chart options
      showLegend,
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
      label,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Palette
      palette,
    } = visualOptions;

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,

        zlevel: -1,
        z: -1,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.xAxisValues || [],
        zlevel: -1,
        z: -1,
        axisLabel: {
          show: label,
        },
      },
      yAxis: {
        type: "value",
        zlevel: -1,
        z: -1,
        nameTextStyle: {
          align: "left",
        },
        axisLabel: {
          show: label,
        },
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 20,
            },
            {
              show: true,
            },
          ]
        : null,
      legend: {
        show: showLegend,
        icon: "roundRect",
      },
      // backgroundColor: background,
      backgroundColor: "transparent",

      series: data.series.map((d: any) => ({
        type: "line",
        name: d.name,
        data: data.xAxisValues.map((x: any) => d.values[x] || 0),
        stack: "Total",
        areaStyle: {},
        lineStyle: {
          type: lineType,
          width: lineWidth,
        },
        z: -1,
        zlevel: -1,
      })),
      tooltip: {
        show: showTooltip,
        trigger: "axis",

        confine: true,
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
    };
  }

  function echartsBubblechart(data: any, visualOptions: any, mapping: any) {
    const {
      // artboard
      showLegend,
      // margin
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Label
      showLabels,
      labelFontSize,
      // Palette
      palette,
      // chart
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
    } = visualOptions;
    const groups = Object.keys(data);

    const maxSize = Math.max(
      ...groups.map((group) =>
        data[group].reduce((prev: number, curr: any) => {
          return Math.max(prev, curr.size);
        }, 0)
      )
    );

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      legend: {
        right: "10%",
        top: "3%",
        data: groups,
        show: showLegend,
      },
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,
      },
      xAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        type: mapping.x.mappedType === "date" ? "category" : "value",
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: "dashed",
          },
        },
        type: mapping.y.mappedType === "date" ? "category" : "value",
        scale: true,
        name: mapping?.y?.value?.[0] ?? "",
        nameTextStyle: {
          align: "left",
        },
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 100,
            },
            {
              show: true,
            },
          ]
        : null,
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => {
          return `${params.data[3]}: ${
            isMonetaryValue
              ? formatFinancialValue((params.data[2] / 50) * maxSize, true)
              : (params.data[2] / 50) * maxSize
          }`;
        },
      },
      series: groups.map((group) => ({
        name: group,
        data: data[group].map((item: any) => [
          item.x,
          item.y,
          (item.size / maxSize) * 50, // making the symbol size relative to the max value but max at 50,
          item.label,
          item.color,
        ]),
        type: "scatter",
        symbolSize: function (singleData: any) {
          return singleData[2];
        },
        label: { show: showLabels, fontSize: labelFontSize },
        emphasis: {
          focus: "series",
          label: {
            show: true,
            formatter: function (param: any) {
              return param.data[3];
            },
            position: "top",
          },
        },
        itemStyle: {
          shadowBlur: 10,
          shadowColor: "rgba(120, 36, 50, 0.5)",
          shadowOffsetY: 5,
        },
      })),
    };
  }

  function echartsScatterchart(data: any, visualOptions: any, mapping: any) {
    const {
      // margin
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      //chart
      symbolSize,
      // Palette
      palette,
      // chart
      dataZoom,
      dataZoomStart,
      dataZoomEnd,
      trendline,
    } = visualOptions;

    const list = checkLists.find((item) => item.label === palette)?.value ?? [];
    const splicedCheckLists = [...list];
    splicedCheckLists.splice(1, 0, "#000000");

    return {
      color: splicedCheckLists,
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
        containLabel: true,

        zlevel: -1,
        z: -1,
      },
      xAxis: {
        type: mapping.x.mappedType === "date" ? "category" : "value",
      },
      yAxis: {
        type: mapping.y.mappedType === "date" ? "category" : "value",
        name: mapping?.y?.value?.[0] ?? "",
        nameTextStyle: {
          align: "left",
        },
      },
      dataZoom: dataZoom
        ? [
            {
              type: "inside",
              start: dataZoomStart ?? 0,
              end: dataZoomEnd ?? 100,
            },
            {
              show: true,
            },
          ]
        : null,
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
        // trigger: showTooltip ? "item" : "none",
        confine: true,
        extraCssText: "border-radius: 20px;",
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },

      dataset: [
        {
          source: data.map((d: any) => [d.x, d.y]),
        },
        {
          transform: {
            type: "ecStat:regression",
            formulaOn: "start",
            config: {
              method:
                ["linear", "exponential", "logarithmic", "polynomial"].find(
                  (m) => m === trendline?.toLowerCase()
                ) ?? "linear",
            },
          },
        },
      ],
      series: [
        {
          symbolSize: symbolSize ?? 4,
          type: "scatter",
          name: "scatter",
          datasetIndex: 0,
        },
        trendline === "None" || data.length === 0
          ? {}
          : {
              name: "line",
              type: "line",
              smooth: true,
              datasetIndex: 1,
              symbolSize: 0.1,
              symbol: "circle",
              labelLayout: { dx: -20 },
              encode: { label: 2, tooltip: 1 },
              lineStyle: {
                color: "black",
              },
            },
      ],
    };
  }

  function echartsHeatmap(data: any, visualOptions: any) {
    const {
      //artboard
      width,
      height,
      // margin
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Label
      showLabels,
      labelFontSize,
      // Palette
      palette,
    } = visualOptions;

    const xAxisData = sortBy(data.filter((d: any) => d.x).map((d: any) => d.x));

    const isYear = (d: any) => {
      if (isNaN(d)) {
        return false;
      }
      return d > 1000 && d <= new Date().getFullYear();
    };

    const isXAxisYear = xAxisData.every(isYear);

    const yAxisData = sortBy(data.filter((d: any) => d.y).map((d: any) => d.y));

    const isYAxisYear = yAxisData.every(isYear);

    const seriesData = data.map((item: any) => [
      isXAxisYear ? String(item.x) : item.x,
      isYAxisYear ? String(item.y) : item.y,
      item.size,
    ]);

    return {
      grid: {
        top: marginTop,
        left: marginLeft,
        right: marginRight,
        bottom: marginBottom,
      },
      xAxis: {
        type: "category",
        data: uniqBy(xAxisData, (d: any) => d),
        splitArea: {
          show: true,
        },
      },
      yAxis: {
        type: "category",
        data: uniqBy(yAxisData, (d: any) => d),
        splitArea: {
          show: true,
        },
      },
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
      visualMap: {
        min: Math.min(...data.map((item: any) => item.size)),
        max: Math.max(...data.map((item: any) => item.size)),
        calculable: true,
        realtime: false,
        inRange: {
          color: checkLists.find((item) => item.label === palette)?.value,
        },
        show: false,
      },
      series: [
        {
          type: "heatmap",
          data: seriesData,
          label: {
            show: showLabels,
            fontSize: labelFontSize,
          },
          emphasis: {
            itemStyle: {
              borderColor: "#333",
              borderWidth: 1,
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          progressive: 1000,
          animation: false,
          width,
          height,
        },
      ],
    };
  }

  function echartsRadarchart(data: any, visualOptions: any) {
    const {
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // Palette
      palette,
      showLegend,
    } = visualOptions;

    return {
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        valueFormatter: (value: number | string) =>
          valueFormatter2(value, isMonetaryValue),
      },
      legend: {
        type: "scroll",
        top: 10,
        data: data.categories.map((color: any) => String(color)),
        show: showLegend,
      },
      visualMap: {
        top: "middle",
        right: 10,
        color: checkLists.find((item) => item.label === palette)?.value,
        show: false,
        calculable: true,
      },

      radar: {
        indicator: data.indicators,
      },
      series: data.data.map((item: any) => ({
        type: "radar",
        symbol: "none",
        lineStyle: {
          width: 1,
        },
        emphasis: {
          areaStyle: {
            color: "rgba(0,250,0,0.3)",
          },
        },
        data: [
          {
            value: item.value,
            name: String(item.name),
          },
        ],
      })),
    };
  }

  const formatSankeyTooltip = (params: any, isMonetaryValue: boolean) => {
    let result = "";
    if (params.data.source && params.data.target && params.data.value) {
      let source = "";
      let target = "";
      let splits = params.data.source.split("-");
      if (splits.length === 1) {
        source = params.data.source;
      } else {
        source = splits.slice(1).join("-");
      }
      splits = params.data.target.split("-");
      if (splits.length === 1) {
        target = params.data.target;
      } else {
        target = splits.slice(1).join("-");
      }
      result = `${source} - ${target}: ${
        isMonetaryValue
          ? formatFinancialValue(params.data.value, true)
          : params.data.value
      }`;
    } else {
      let name = "";
      let splits = params.name.split("-");
      if (splits.length === 1) {
        name = params.name;
      } else {
        name = splits.slice(1).join("-");
      }
      result = name;
    }
    return result;
  };

  function echartsSankey(data: any, visualOptions: any) {
    const {
      // artboard
      height,
      background,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      nodesWidth,
      nodesPadding,
      linksOpacity,
      nodeAlign,
      orient,
      // Labels
      showLabels,
      showEdgeLabels,
      labelRotate,
      labelPosition,
      labelFontSize,
      // Tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;

    let nodes: { name: string }[] = [];
    data.forEach((d: any) => {
      nodes.push({ name: d.source });
      nodes.push({ name: d.target });
    });
    nodes = uniqBy(nodes, "name");

    return {
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          type: "sankey",
          data: nodes,
          links: data,
          height: height * 0.9,
          orient,
          nodeAlign,
          edgeLabel: {
            show: showEdgeLabels,
          },
          top: marginTop + height * 0.05,
          left: showLabels
            ? labelPosition === "left"
              ? `${marginLeft + 15}%`
              : `${marginLeft}%`
            : `${marginLeft}%`,
          right: showLabels
            ? labelPosition === "right"
              ? `${marginRight + 15}%`
              : `${marginRight}%`
            : `${marginRight}%`,
          bottom: marginBottom,
          nodeGap: nodesPadding,
          nodeWidth: nodesWidth,
          emphasis: {
            focus: "adjacency",
          },
          lineStyle: {
            curveness: 0.5,
            color: "source",
            opacity: linksOpacity,
          },

          label: {
            show: showLabels,
            rotate: labelRotate,
            position: labelPosition,
            fontSize: labelFontSize,
            textShadowColor: "#fff",
            textShadowBlur: 1,
            color: "#000",
            textBorderColor: "rgba(255, 252, 252, 1)",
            textBorderWidth: 2.5,
          },
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) =>
          formatSankeyTooltip(params, isMonetaryValue),
      },
    };
  }

  const valueFormatter1 = (params: any, isMonetaryValue: boolean) => {
    if (params.dataType === "node") {
      const value = isMonetaryValue
        ? formatFinancialValue(params.data.value, true)
        : params.data.value;
      return `${params.name}: ${value ?? "unspecified"}`;
    }
    return params.name;
  };

  const setLinkOpacity = (link: any, linksOpacity: number) => {
    link.lineStyle = {
      opacity: linksOpacity,
    };
  };

  function echartsForcegraph(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      showLegend,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      linksOpacity,
      roam,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // labels
      showLabels,
      labelFontSize,
      // chart
      forceRepulsion,
      // Palette
      palette,
    } = visualOptions;

    const nodes = uniqBy(data.nodes, "name");

    const maxValue = nodes?.reduce((prev: number, curr: any) => {
      return Math.max(prev, curr.value);
    }, 0);

    nodes?.forEach(function (node: any) {
      node.symbolSize = (node.value / maxValue) * 20; // making the symbol size relative to the max value but max at 50
    });

    data.links?.forEach((link: any) => setLinkOpacity(link, linksOpacity));

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      legend: [
        {
          data: data.categories?.map(function (a: { name: string }) {
            return a.name;
          }),
          // show: showLegend,
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        formatter: (params: any) => valueFormatter1(params, isMonetaryValue),
      },
      series: [
        {
          type: "graph",
          layout: "force",
          data: nodes,
          links: data.links,
          categories: data.categories,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          width,
          height,
          roam: !!roam,
          label: {
            position: "right",
            show: showLabels,
            fontSize: labelFontSize,
          },
          force: {
            repulsion: forceRepulsion,
          },
        },
      ],
    };
  }

  function echartsCirculargraph(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      showLegend,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      linksOpacity,
      roam,
      linksCurveness,
      // Tooltip
      showTooltip,
      isMonetaryValue,
      // labels
      showLabels,
      labelFontSize,
      rotateLabel,
      // Palette
      palette,
    } = visualOptions;

    const maxValue = data.nodes?.reduce((prev: number, curr: any) => {
      return Math.max(prev, curr.value);
    }, 0);

    data.nodes?.forEach(function (node: any) {
      node.symbolSize = (node.value / maxValue) * 50; // making the symbol size relative to the max value but max at 50
      let show = true;
      if (showLabels === "largeNodes") {
        show = node.symbolSize > 30;
      } else if (showLabels === "false") {
        show = false;
      }
      node.label = {
        show,
      };
    });

    data.links?.forEach((link: any) => setLinkOpacity(link, linksOpacity));

    const nodes = uniqBy(data.nodes, "name");

    const option = {
      color: checkLists.find((item) => item.label === palette)?.value,
      legend: [
        {
          align: "left",
          show: showLegend,
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        formatter: (params: any) => valueFormatter1(params, isMonetaryValue),
      },
      animationDurationUpdate: 1500,
      animationEasingUpdate: "quinticInOut",
      series: [
        {
          type: "graph",
          layout: "circular",
          circular: {
            rotateLabel: rotateLabel,
          },
          data: nodes,
          links: data.links,
          categories: data.categories,
          top: marginTop + height * 0.05,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          width,
          height: height * 0.9 - marginTop - marginBottom, // Default height from echarts is overflowing so I had to remove .5 percent from the height to fit
          roam: !!roam,
          force: {
            repulsion: 100,
          },
          label: {
            position: "right",
            formatter: "{b}",
            fontSize: labelFontSize,
            // width: 50,
            overflow: "truncate",
          },
          lineStyle: {
            color: "source",
            curveness: linksCurveness,
          },
        },
      ],
    };
    return option as any;
  }

  function echartsGraphgl(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      showLegend,
      // margins
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // chart options
      opacity,
      // palette
      palette,
    } = visualOptions;

    const maxValue = data.nodes?.reduce((prev: number, curr: any) => {
      return Math.max(prev, curr.value);
    }, 0);

    data.nodes?.forEach(function (node: any) {
      node.symbolSize = (node.value / maxValue) * 10; // making the symbol size relative to the max value but max at 50
    });

    const nodes = uniqBy(data.nodes, "name");

    return {
      color: checkLists.find((item) => item.label === palette)?.value,
      series: [
        {
          width,
          height,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          type: "graphGL",
          nodes: nodes,
          edges: data.links,
          categories: data.categories,
          lineStyle: {
            color: "rgba(255,255,255,0.2)",
          },
          itemStyle: {
            opacity: opacity,
          },
          forceAtlas2: {
            steps: 1,
            stopThreshold: 1,
            jitterTolerence: 10,
            edgeWeight: [0.2, 1],
            gravity: 0,
            edgeWeightInfluence: 1,
            scaling: 0.2,
          },
        },
      ],
    };
  }

  function echartsTreemap(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      // labels
      showLabels,
      upperLabel,
      labelFontSize,
      nodeClick,
      showBreadcrumbs,
      // tooltip
      showTooltip,
      isMonetaryValue,
    } = visualOptions;
    return {
      // backgroundColor: background,
      backgroundColor: "transparent",
      series: [
        {
          nodeClick: nodeClick === "false" ? false : nodeClick,
          name: "All",
          type: "treemap",
          data,
          width,
          height,
          roam: false,
          top: marginTop,
          left: marginLeft,
          right: marginRight,
          bottom: marginBottom,
          leafDepth: 1,
          label: {
            show: showLabels,
            fontSize: labelFontSize,
          },
          upperLabel: {
            show: upperLabel,
            fontSize: labelFontSize,
          },
          breadcrumb: {
            show: showBreadcrumbs,
            top: 0,
            bottom: "auto",
          },
        },
      ],
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        confine: true,
        formatter: (params: any) => valueFormatter1(params, isMonetaryValue),
      },
    };
  }

  function echartsCirclepacking(
    data: any,
    visualOptions: any,
    targetPath: string | null
  ) {
    return drillDown(data, targetPath, visualOptions);
  }

  function echartsSunburst(data: any, visualOptions: any) {
    const {
      // artboard
      width,
      height,
      centerX,
      centerY,
      borderRadius,
      borderWidth,
      // labels
      showLabels,
      leafLabelPositon,
      labelFontSize,
      // tooltip
      showTooltip,
      isMonetaryValue,
      // Palette
      palette,
    } = visualOptions;

    let maxDepth = 0;

    const countDepth = (children: any[]) => {
      if (children) {
        maxDepth += 1;
        countDepth(children[0]?.children);
      }
    };
    countDepth(data);

    return {
      // backgroundColor: background,
      backgroundColor: "transparent",
      color: checkLists.find((item) => item.label === palette)?.value,
      tooltip: {
        trigger: showTooltip ? "item" : "none",
        formatter: (params: any) => valueFormatter1(params, isMonetaryValue),
      },
      series: [
        {
          name: "All",
          type: "sunburst",
          data,
          radius: ["15%", "95%"],
          sort: undefined,
          emphasis: {
            focus: "ancestor",
          },
          itemStyle: {
            borderRadius,
            borderWidth,
          },
          levels: [
            {},
            ...Array(maxDepth - 1).fill({}),
            {
              label: {
                position: leafLabelPositon,
                padding: 3,
                silent: false,
                show: showLabels !== "false",
              },
            },
          ],
          width,
          height: height,
          roam: false,
          center: [`${centerX}%`, `${centerY}%`],

          leafDepth: 1,
          label: {
            show: showLabels !== "false",
            fontSize: labelFontSize,
          },
        },
      ],
    };
  }
  function bigNumberRender(data: any, node: HTMLElement) {
    const formatedData = {
      ...data,
      metric: data?.mainKPImetric?.value[0] || data.metric,
      unitofmeasurement: data?.unitofmeasurement?.value[0],
      header: data?.header?.value[0],
      subheader: data?.subheader?.value[0],
    };

    const renderBigNumber = charts["bigNumber"].render;
    renderBigNumber(node, formatedData);
  }

  const handleDataZoom = (event: any) => {
    if (!readOnly) {
      if (event.batch) {
        debouncedSetVisualOptions({
          ...mainVisualOptions,
          dataZoomStart: event.batch[0].start,
          dataZoomEnd: event.batch[0].end,
        });
      } else {
        debouncedSetVisualOptions({
          ...mainVisualOptions,
          dataZoomStart: event.start,
          dataZoomEnd: event.end,
        });
      }
    }
  };

  function render(
    data: any,
    node: HTMLElement,
    chartType:
      | "echartsBarchart"
      | "echartsGeomap"
      | "echartsLinechart"
      | "echartsAreatimeaxis"
      | "echartsAreastack"
      | "echartsSankey"
      | "echartsTreemap"
      | "bigNumber"
      | "echartsSunburst"
      | "echartsForcegraph"
      | "echartsCirculargraph"
      | "echartsPiechart"
      | "echartsBubblechart"
      | "echartsMultisetBarchart"
      | "echartsStackedBarchart"
      | "echartsScatterchart"
      | "echartsHeatmap"
      | "echartsGraphgl"
      | "echartsRadarchart"
      | "echartsCirclepacking",

    visualOptions: any,
    mapping: any,
    id: string,
    chartId: string = ""
  ) {
    if (chartId) {
      const chartKey = `key_${chartId}`;
      setChartsRendered((prev: any) => ({
        ...prev,
        [chartKey]: {
          ...prev?.[chartKey],
          renderCount: (prev?.[chartKey]?.renderCount ?? 0) + 1,
        },
      }));
    }

    if (chartType === "bigNumber") {
      bigNumberRender(data, node);
    } else {
      new ResizeObserver(() => onResize(chart, id, node.clientHeight)).observe(
        node
      );

      const chart = echarts.init(node, undefined, {
        renderer: "canvas",
        height: visualOptions.height,
      });

      window.removeEventListener("resize", () => onResize(chart, id));

      const CHART_TYPE_TO_COMPONENT = {
        echartsBarchart: () => echartsBarchart(data, visualOptions, mapping),
        echartsMultisetBarchart: () =>
          echartsMultisetBarchart(data, visualOptions, mapping),
        echartsStackedBarchart: () =>
          echartsStackedBarchart(data, visualOptions, mapping),
        echartsGeomap: () => echartsGeomap(data, visualOptions),
        echartsLinechart: () => echartsLinechart(data, visualOptions, mapping),
        echartsAreatimeaxis: () =>
          echartsAreatimeaxis(data, visualOptions, mapping),
        echartsAreastack: () => echartsAreastack(data, visualOptions, mapping),
        echartsSankey: () => echartsSankey(data, visualOptions),
        echartsTreemap: () => echartsTreemap(data, visualOptions),
        echartsSunburst: () => echartsSunburst(data, visualOptions),
        echartsForcegraph: () => echartsForcegraph(data, visualOptions),
        echartsCirculargraph: () => echartsCirculargraph(data, visualOptions),
        echartsPiechart: () => echartsPiechart(data, visualOptions),
        echartsBubblechart: () =>
          echartsBubblechart(data, visualOptions, mapping),
        echartsScatterchart: () =>
          echartsScatterchart(data, visualOptions, mapping),
        echartsHeatmap: () => echartsHeatmap(data, visualOptions),
        echartsGraphgl: () => echartsGraphgl(data, visualOptions),
        echartsRadarchart: () => echartsRadarchart(data, visualOptions),
        echartsCirclepacking: () =>
          echartsCirclepacking(data, visualOptions, null),
      };
      // @ts-expect-error one is deprecated in echarts 5
      chart.one("finished", () => {
        if (chartId) {
          const chartKey = `key_${chartId}`;
          setChartsRendered((prev: any) => ({
            ...prev,
            [chartKey]: {
              ...prev?.[chartKey],
              finishedCount: (prev?.[chartKey]?.finishedCount ?? 0) + 1,
            },
          }));
        }
      });

      chart.setOption(CHART_TYPE_TO_COMPONENT[chartType](), true);

      window.addEventListener("resize", () => onResize(chart, id));
      if (chartType === "echartsCirclepacking") {
        chart.on("click", { seriesIndex: 0 }, (params: any) => {
          chart.setOption(
            echartsCirclepacking(data, visualOptions, params.data.path)
          );
        });

        // Reset: click on the blank area.
        chart.getZr().on("click", function (event) {
          if (!event.target) {
            chart.setOption(echartsCirclepacking(data, visualOptions, null));
          }
        });
      }

      chart.on("datazoom", handleDataZoom);
    }
  }

  return { render };
}
