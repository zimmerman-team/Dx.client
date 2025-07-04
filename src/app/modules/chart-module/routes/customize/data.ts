import { ChartType } from "app/modules/chart-module/components/common-chart";

export interface ChartBuilderCustomizeProps {
  loading: boolean;
  dimensions: any[];
  mappedData: any[];
  visualOptions: any;
  renderedChart: string;
  renderedChartMappedData: any;
  setVisualOptions: (value: any) => void;
  setChartErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  setChartError: React.Dispatch<React.SetStateAction<boolean>>;
  renderedChartType: ChartType;
  containerRef: React.RefObject<HTMLDivElement>;
  isAIAssistedChart: boolean;
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
  chartName: string;
}

export const checkLists = [
  {
    label: "DataXplorer default",
    value: ["#E75656", "#E492BD", "#F6C445", "#73D3CD", "#6061E5"],
  },
  {
    label: "Nordic Aurora",

    value: ["#E0BAFD", "#94A8E4", "#5291BC", "#23768C", "#175A5C"],
  },
  {
    label: "Sunset coast",

    value: ["#FDA529", "#FD6565", "#BB5390", "#58528C", "#05405B"],
  },
  {
    label: "Warm tone",

    value: ["#F5DCFE", "#D3A4C5", "#B26E87", "#8A3C49", "#5B0C0E"],
  },
  {
    label: "Sprint forest",
    value: ["#D0FEA3", "#A4D37E", "#7BA95A", "#538137", "#2B5B16"],
  },

  {
    label: "Purple Gradient",
    value: ["#DADAF8", "#DAB5FF", "#B194D1", "#655579", "#231D2C"],
  },
];
