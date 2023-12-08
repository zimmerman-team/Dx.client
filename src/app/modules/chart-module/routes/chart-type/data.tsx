import BarChartIcon from "app/assets/icons/data-themes-chart-types/bar";
import ColoredBarChartIcon from "app/assets/icons/data-themes-chart-types/coloredBarChart";

import GeomapChartIcon from "app/assets/icons/data-themes-chart-types/geomap";
import ColoredGeomapChartIcon from "app/assets/icons/data-themes-chart-types/coloredGeomap";

import LineChartIcon from "app/assets/icons/data-themes-chart-types/line";
import ColoredLineChartIcon from "app/assets/icons/data-themes-chart-types/coloredLineChart";

import SankeyChartIcon from "app/assets/icons/data-themes-chart-types/sankeydiagram";
import ColoredSankeyChartIcon from "app/assets/icons/data-themes-chart-types/coloredSankeyDiagram";

import TreeMapIcon from "app/assets/icons/data-themes-chart-types/treemap";
import ColoredTreeMapIcon from "app/assets/icons/data-themes-chart-types/coloredTreemap";

import BigNumberIcon from "app/assets/icons/data-themes-chart-types/bigNumber";
import ColoredBigNumberIcon from "app/assets/icons/data-themes-chart-types/coloredBigNumber";

import SunburstIcon from "app/assets/icons/data-themes-chart-types/sunburst";
import ColoredSunburstIcon from "app/assets/icons/data-themes-chart-types/coloredSunburst";

import PieIcon from "app/assets/icons/data-themes-chart-types/pie";
import ColoredPieIcon from "app/assets/icons/data-themes-chart-types/coloredPie";

import CirclePackingIcon from "app/assets/icons/data-themes-chart-types/circlepacking";
import ColoredCirclePackingIcon from "app/assets/icons/data-themes-chart-types/coloredCirclepacking";

export interface ChartBuilderChartTypeProps {
  loading: boolean;
}

export interface ChartTypeModel {
  id: string;
  label: string;
  icon: React.ReactNode;
  categories: string[];
  description: string;
  ssr: boolean;
}

export const echartTypes = (big: boolean) => {
  return [
    {
      id: "echartsBarchart",
      label: "Bar chart",
      icon: <BarChartIcon big={big} />,
      categories: ["Correllations"],
      ssr: false,
      description:
        "It displays a categorical dimension and related amounts. Each bar represents a category, width is proportional to the quantitative dimension.",
    },
    {
      id: "echartsGeomap",
      label: "Geo map",
      icon: <GeomapChartIcon big={big} />,
      categories: ["Locations"],
      ssr: false,
      description: "Geo map",
    },
    {
      id: "echartsLinechart",
      label: "Line chart",
      icon: <LineChartIcon big={big} />,
      categories: ["Trends", "changes over time"],
      ssr: false,
      description:
        "It displays a quantitative dimension over a continuous interval or time period. Colour can be optionally used to encode an additional quantitative or categorical dimension.",
    },
    {
      id: "echartsSankey",
      label: "Sankey diagram",
      icon: <SankeyChartIcon big={big} />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as rectangles, the height represents their value. Flows are represented with curved lines whose width is proportional to their value.",
    },
    {
      id: "echartsTreemap",
      label: "Treemap diagram",
      icon: <TreeMapIcon big={big} />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension. It is composed of an area divided into small rectangles, representing the last level of the tree structure. The rectangles' size depends on the quantitative dimension.",
    },
    {
      id: "bigNumber",
      label: "Big number",
      icon: <BigNumberIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: true,
      description:
        "It displays hierarchically structured data and a related quantitative dimension. It is composed of an area divided into small rectangles, representing the last level of the tree structure. The rectangles' size depends on the quantitative dimension.",
    },
    {
      id: "echartsSunburst",
      label: "Sunburst diagram",
      icon: <SunburstIcon big={big} />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension using concentric circles. The circle in the center represents the root node, with the hierarchies moving outward from the center. The angle of each arc corresponds to the qualitative dimension.",
    },
    {
      id: "echartsPiechart",
      label: "Pie Chart",
      icon: <PieIcon big={big} />,
      categories: ["Proportions"],
      ssr: false,
      description:
        "It allows you to see the proportions between values that make up a whole, by using arcs composing a circle.",
    },
    {
      id: "echartsCirclepacking",
      label: "Circle Packing Chart",
      icon: <CirclePackingIcon big={big} />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays values of leaf nodes of a hierarchical structure by using circles areas. The hierarchical structure is depicted using nested circles. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
    {
      id: "placeholder3",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder4",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder5",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder7",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder8",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder9",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
    {
      id: "placeholder10",
      label: "",
      icon: <></>,
      categories: [],
      ssr: false,
      description: "",
    },
  ];
};

export const coloredEchartTypes = () => {
  return [
    {
      id: "echartsBarchart",
      label: "Bar chart",
      icon: <ColoredBarChartIcon />,
      categories: ["Correllations"],
      ssr: false,
      description:
        "It displays a categorical dimension and related amounts. Each bar represents a category, width is proportional to the quantitative dimension.",
    },
    {
      id: "echartsGeomap",
      label: "Geo map",
      icon: (
        <ColoredGeomapChartIcon
          css={`
            margin-left: -5px;
          `}
        />
      ),
      categories: ["Locations"],
      ssr: false,
      description: "Geo map",
    },
    {
      id: "echartsLinechart",
      label: "Line chart",
      icon: <ColoredLineChartIcon />,
      categories: ["Trends", "changes over time"],
      ssr: false,
      description:
        "It displays a quantitative dimension over a continuous interval or time period. Colour can be optionally used to encode an additional quantitative or categorical dimension.",
    },
    {
      id: "echartsSankey",
      label: "Sankey diagram",
      icon: <ColoredSankeyChartIcon />,
      categories: ["Networks"],
      ssr: false,
      description:
        "It represents flows among nodes of a network. Nodes are represented as rectangles, the height represents their value. Flows are represented with curved lines whose width is proportional to their value.",
    },
    {
      id: "echartsTreemap",
      label: "Treemap diagram",
      icon: <ColoredTreeMapIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension. It is composed of an area divided into small rectangles, representing the last level of the tree structure. The rectangles’ size depends on the quantitative dimension.",
    },
    {
      id: "bigNumber",
      label: "Big Number diagram",
      icon: <ColoredBigNumberIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: true,
      description:
        "It displays hierarchically structured data and a related quantitative dimension. It is composed of an area divided into small rectangles, representing the last level of the tree structure. The rectangles’ size depends on the quantitative dimension.",
    },
    {
      id: "echartsSunburst",
      label: "Sunburst diagram",
      icon: <ColoredSunburstIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays hierarchically structured data and a related quantitative dimension using concentric circles. The circle in the center represents the root node, with the hierarchies moving outward from the center. The angle of each arc corresponds to the qualitative dimension.",
    },
    {
      id: "echartsPiechart",
      label: "Pie Chart",
      icon: <ColoredPieIcon />,
      categories: ["Proportions"],
      ssr: false,
      description:
        "It allows you to see the proportions between values that make up a whole, by using arcs composing a circle.",
    },
    {
      id: "echartsCirclepacking",
      label: "Circle Packing Chart",
      icon: <ColoredCirclePackingIcon />,
      categories: ["Hierarchies", "Proportions"],
      ssr: false,
      description:
        "It displays values of leaf nodes of a hierarchical structure by using circles areas. The hierarchical structure is depicted using nested circles. A further quantitative dimension with size and a quantitative or categorical dimension with color.",
    },
  ];
};
