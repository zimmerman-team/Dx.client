/* third-party */
import React from "react";

import { useStoreState } from "app/state/store/hooks";

import { useLocation } from "react-router-dom";
import useUpdateEffect from "react-use/lib/useUpdateEffect";

/* project */
import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { ChartToolBoxMapping } from "app/modules/chart-module/components/toolbox/views/steps/panels-content/Mapping";
import { ChartToolBoxFilters } from "app/modules/chart-module/components/toolbox/views/steps/panels-content/Filters";
import { ChartToolBoxChartType } from "app/modules/chart-module/components/toolbox/views/steps/panels-content/ChartType";
import { ChartToolBoxCustomize } from "app/modules/chart-module/components/toolbox/views/steps/panels-content/Customize";
import { DatasetPanel } from "app/modules/chart-module/components/toolbox/views/steps/panels-content/SelectDataset";

import { isEmpty } from "lodash";
import { ToolboxNavType } from "./navbar";

interface ChartToolBoxStepsProps {
  data: { [key: string]: string | number | null }[];
  loading: boolean;
  mappedData?: any;
  openPanel?: number;
  dataTypes: any;
  visualOptions?: any;
  forceNextEnabled?: boolean;
  filtersView?: boolean;
  rawViz?: any;
  save: () => void;
  filterOptionGroups: FilterGroupModel[];
  setVisualOptions?: (value: any) => void;
  loadDataset: (endpoint: string) => Promise<boolean>;
  dimensions: any[];
  activeStep: ToolboxNavType;
  onNavBtnClick: (name: ToolboxNavType) => void;

  stepPaths: { name: string; path: string }[];
}

export function ChartToolBoxSteps(props: ChartToolBoxStepsProps) {
  const location = useLocation();

  const { filterOptionGroups } = props;
  const [_expanded, setExpanded] = React.useState<number>(props.openPanel ?? 0);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  let appliedFiltersCount = 0;

  Object.keys(appliedFilters || {}).forEach((key) => {
    appliedFiltersCount += appliedFilters[key].length;
  });

  const handleSave = () => {
    if (!isEmpty(props.mappedData)) {
      props.save();
    }
  };

  const currentPath = location.pathname;
  const currentPathIndex = props.stepPaths.findIndex(
    (s) => s.path === currentPath
  );
  const handleNext = () => {
    const nextStep = props.stepPaths[currentPathIndex + 1]?.name;
    props.onNavBtnClick(nextStep as ToolboxNavType);

    if (currentPathIndex == 5) {
      handleSave();
    } else {
      return;
    }
  };

  const handleBack = () => {
    const prevPath = props.stepPaths[currentPathIndex - 1]?.path;
    const prevStep = props.stepPaths[currentPathIndex - 1]?.name;
    props.onNavBtnClick(prevStep as ToolboxNavType);
    console.log(currentPath, prevPath, prevStep);
    if (currentPathIndex == 0) {
      return;
    }
  };
  const displayToolboxPanel = () => {
    switch (props.activeStep) {
      case "dataset":
      case "selectDataset":
        return <DatasetPanel />;
      case "chart":
        return <ChartToolBoxChartType />;
      case "mapping":
        return (
          <ChartToolBoxMapping
            dataTypes={props.dataTypes}
            dimensions={props.dimensions}
          />
        );
      case "filters":
        return <ChartToolBoxFilters filterOptionGroups={filterOptionGroups} />;
      case "customize":
        return (
          <ChartToolBoxCustomize
            dataTypes={props.dataTypes}
            mappedData={props.mappedData}
            visualOptions={props.visualOptions}
            setVisualOptions={props.setVisualOptions}
          />
        );

      default:
        return <DatasetPanel />;
    }
  };

  useUpdateEffect(() => setExpanded(props.openPanel ?? 0), [props.openPanel]);

  return (
    <div>
      <div
        css={`
          width: 400px;
          overflow-y: scroll;
          height: calc(100vh - ${!props.filtersView ? 229 : 105}px);
          position: relative;

          &::-webkit-scrollbar {
            width: 5px;
            background: #231d2c;
          }
          &::-webkit-scrollbar-track {
            background: #f5f5f7;
          }
          &::-webkit-scrollbar-thumb {
            background: #231d2c;
          }
        `}
      >
        {displayToolboxPanel()}
      </div>
      <div
        css={`
          display: flex;
          gap: 8px;
          height: 64px;
          align-items: center;
          justify-content: center;

          background: #f5f5f7;
          button {
            outline: none;
            border: none;
            border-radius: 8px;
            width: 188px;
            height: 48px;
            background: #dfe3e5;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: "Gotham Narrow", sans-serif;
            :nth-child(1) {
              background: #dfe3e5;
              color: #262c34;
            }
            :nth-child(2) {
              background: #262c34;
              color: #fff;
            }
            &:hover {
              opacity: 0.9;
              cursor: pointer;
            }
          }
        `}
      >
        <button type="button" onClick={handleBack}>
          Back{" "}
        </button>
        <button onClick={handleNext}>
          {currentPathIndex < 5 ? "Next" : "Save"}
        </button>
      </div>
    </div>
  );
}
