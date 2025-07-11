import React from "react";
import get from "lodash/get";
import {
  getTypeName,
  getDefaultDimensionAggregation,
  getAggregatorNames,
  // @ts-ignore
} from "@rawgraphs/rawgraphs-core";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { uniqueId, filter, isEmpty, set } from "lodash";
import { Box, Button, IconButton } from "@material-ui/core";
import ToolboxSubheader from "app/modules/chart-module/components/toolbox/steps/sub-header";
import { ReactComponent as DateIcon } from "app/modules/chart-module/assets/date.svg";
import CloseIcon from "@material-ui/icons/Close";
import { mappingStyles } from "app/modules/chart-module/components/toolbox/styles";
import SearchIcon from "@material-ui/icons/Search";
import { useDebounce } from "react-use";
import {
  ChartAPIModel,
  ChartRenderedItem,
  emptyChartAPI,
} from "app/modules/chart-module/data";
import { Dropdown } from "react-bootstrap";
import { areAllRequiredDimensionsMapped } from "app/hooks/useChartsRawData";
import Skeleton from "@material-ui/lab/Skeleton";
import { chartTypesFromMiddleWare } from "app/modules/chart-module/routes/chart-type/data";
import { isChartAutoMappedAtom } from "app/state/recoil/atoms";
import { useRecoilState } from "recoil";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface ChartToolBoxMappingProps {
  dataTypes: any;
  dimensions: any[];
  loading: boolean;
  setChartFromAPI: (
    value: React.SetStateAction<ChartRenderedItem | null>
  ) => void;
}

interface dimensionProp {
  id: string;
  name: string;
  validTypes: any;
  required: boolean;
  aggregation: boolean;
  aggregationDefault: "sum" | "avg" | "count" | "min" | "max";
  mappedValues: string[];
  mapValuesDisplayed: boolean;
}
interface ChartToolBoxMappingItemProps {
  index: number;
  dimension?: any;
  testId: string;
  mappingItemValue: string;
  dataTypes: any[];
  mapSize?: number;
  marginBottom: string;
  backgroundColor?: string;
  type: "string" | "number" | "date";
  nonStaticDimensionsId: number;
  nonStaticDimensionsIndex: number;
  handleNonStaticDimensionsUpdate: (
    nonStaticDimensionsId: number,
    mappingItemValue: any
  ) => void;
  nonStaticDimensions: any[];
  displayCloseButton?: boolean;
  showAggregation: boolean;
  handleButtonToggle?: (id: string) => void;
  setdraggingMappingItem: React.Dispatch<
    React.SetStateAction<{
      isDragging: boolean;
      index: null | number;
    }>
  >;
}

const typeIcon = {
  string: <span>Aa</span>,
  number: <span>#</span>,
  date: <DateIcon />,
};

export const AGGREGATIONS_LABELS = {
  count: "Count",
  mean: "Average",
  median: "Median",
  max: "Max",
  min: "Min",
  countDistinct: "Count unique",
  sum: "Sum",
  csv: "CSV",
  csvDistinct: "CSV (unique)",
};

const MAPPING_ITEM_TYPE = "MAPPING_ITEM";

const DimensionContainerSkeleton = () => {
  return (
    <div
      css={`
        width: 100%;
        padding: 16px;
        border-radius: 11px;
        background: #dfe3e5;
        margin-top: 16px;
      `}
    >
      <Skeleton
        animation="wave"
        variant="rect"
        width="100%"
        height={39}
        style={{ borderRadius: "25px" }}
      />

      <Skeleton
        animation="wave"
        variant="rect"
        width="100%"
        height={39}
        style={{ borderRadius: "25px", marginTop: "16px" }}
      />
    </div>
  );
};
const fetchAISuggestedChartTypes = async (token: string, datasetId: string) => {
  return await axios.get(
    `${process.env.REACT_APP_API}/chart-types/ai-suggestions?id=${datasetId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const handleValidityCheckOfDimensionsToBeMapped = (
  selectedChartDimension: any,
  dimension: any,
  dataTypes: any
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  //get selected data types
  let selectedDataTypes: string[] = [];
  if (typeof selectedChartDimension === "object") {
    Object.keys(selectedChartDimension).forEach((key) => {
      const dataTypeToBeMapped = getTypeName(dataTypes[key as any]);
      selectedDataTypes = [
        ...(selectedDataTypes as string[]),
        dataTypeToBeMapped,
      ];
    });
  } else {
    selectedDataTypes = [getTypeName(dataTypes[selectedChartDimension as any])];
  }

  const isValid = () => {
    if (dimension.validTypes?.length === 0) return true;
    if (typeof selectedChartDimension === "object") {
      //don't map if selected chart has multiple variables for a non multiple dimension
      if (
        !dimension.multiple &&
        Object.keys(selectedChartDimension).length > 1
      ) {
        return false;
      }

      // confirm aggregation from selected chart matches expected aggregation values
      for (let aggr of Object.values(selectedChartDimension)) {
        if (!AGGREGATIONS_LABELS[aggr as keyof typeof AGGREGATIONS_LABELS]) {
          return false;
        }
      }
    }
    //check validity of selected data types
    if (selectedDataTypes.length > 0) {
      for (let c of selectedDataTypes as string[]) {
        return !!dimension.validTypes?.includes(c);
      }
    }

    return false;
  };
  return { isValid, selectedDataTypes };
};

export function ChartToolBoxMapping(props: Readonly<ChartToolBoxMappingProps>) {
  const token = useStoreState((state) => state.AuthToken.value);
  const staticDimensions = filter(props.dimensions, (d: any) => d.static);
  const nonStaticDimensions = React.useMemo(() => {
    return filter(props.dimensions, (d: any) => !d.static).map((d: any) => {
      return {
        ...d,
        mappedValues: [],
        mapValuesDisplayed: false,
      };
    });
  }, [props.dimensions]);

  const [nonStaticDimensionsState, setNonStaticDimensionsState] =
    React.useState(nonStaticDimensions);

  const mapping = useStoreState((state) => state.charts.mapping.value);
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const chartType = useStoreState((state) => state.charts.chartType.value);
  const selectedAIChart = useStoreState(
    (state) => state.charts.SelectedAIChartState.value
  );
  const [isChartAutoMapped, setIsChartAutoMapped] = useRecoilState(
    isChartAutoMappedAtom
  );
  const datasetId = useStoreState((state) => state.charts.dataset.value);
  const setChartSuggestionsCrudData = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.setCrudData
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const selectedAIChartSuggestion = (data: any) => {
    if (!data) return {};

    return data?.find(
      (c: { charttype: keyof typeof chartTypesFromMiddleWare }) =>
        chartTypesFromMiddleWare[c.charttype] === chartType
    );
  };

  const autoMap = async () => {
    try {
      if (!(selectedAIChart && !isChartAutoMapped && isEmpty(mapping))) {
        return;
      }
      const response = await fetchAISuggestedChartTypes(
        token,
        datasetId as string
      );
      const data = response.data;
      //update Crud Data value with data from non-easy-peasy API  call
      setChartSuggestionsCrudData(data);
      const selectedChart = selectedAIChartSuggestion(data);
      if (isEmpty(selectedChart) || isEmpty(props.dataTypes)) {
        return;
      }
      const localMapping: any = {};
      //get mapping from selected ai suggested chart
      props.dimensions.forEach((d) => {
        const { isValid, selectedDataTypes } =
          handleValidityCheckOfDimensionsToBeMapped(
            selectedChart[d.id],
            d,
            props.dataTypes
          );

        if (!isValid()) {
          return;
        }
        localMapping[d.id] = {
          config: d.aggregation
            ? {
                aggregation:
                  typeof selectedChart[d.id] === "object"
                    ? Object.values(selectedChart[d.id]) ?? [
                        d.aggregationDefault,
                      ]
                    : d.aggregationDefault,
              }
            : undefined,
          ids:
            typeof selectedChart[d.id] === "object"
              ? Object.keys(selectedChart[d.id]).map(() => uniqueId())
              : [uniqueId()],
          value:
            typeof selectedChart[d.id] === "object"
              ? Object.keys(selectedChart[d.id])
              : [selectedChart[d.id]],
          mappedType: selectedDataTypes,
          isValid: isValid(),
        };
      });
      setMapping(localMapping);
      setIsChartAutoMapped(true);
    } catch (e) {
      console.log("error in ai suggestions", e);
    }
  };

  React.useEffect(() => {
    autoMap();
  }, [chartType, datasetId, loadedChart, props.dataTypes]);

  const handleButtonToggle = (id: string) => {
    setNonStaticDimensionsState((prev) => {
      return prev.map((data) => {
        if (data.id === id) {
          return {
            ...data,
            mapValuesDisplayed: !data.mapValuesDisplayed,
          };
        }
        return data;
      });
    });
  };

  const handleNonStaticDimensionsUpdate = (
    nonStaticDimensionsId: number,
    mappingItemValue: any
  ) => {
    setNonStaticDimensionsState((prev) => {
      return prev.map((data) => {
        if (data.id === nonStaticDimensionsId) {
          return {
            ...data,
            mappedValues: [...data.mappedValues, mappingItemValue],
            mapValuesDisplayed: false,
          };
        }
        return data;
      });
    });
  };

  React.useEffect(() => {
    //updates non static dimension with mapped values
    let updatedNonStaticDimensions = [...nonStaticDimensions];
    const mappingKeys = Object.keys(mapping);
    mappingKeys.forEach((dimensionId: string) => {
      const nonStaticDimensionIndex = updatedNonStaticDimensions.findIndex(
        (d) => d.id === dimensionId
      );
      if (nonStaticDimensionIndex !== -1) {
        updatedNonStaticDimensions[nonStaticDimensionIndex].mappedValues =
          mapping[dimensionId].value;
      }
    });

    setNonStaticDimensionsState(updatedNonStaticDimensions);
  }, [mapping]);

  // empty rendered chart when req mapping fields are not filled
  const isMappingValid = areAllRequiredDimensionsMapped(
    props.dimensions,
    mapping
  );
  React.useEffect(() => {
    if (!isMappingValid) {
      props.setChartFromAPI(null);
    }
  }, [mapping]);

  const getValidDataTypes = (dimensionTypes: string[], searchValue: string) => {
    const validDataTypes: any = {};
    //get valid data types for the current dimension
    //filter data types by search value
    Object.keys(props.dataTypes)
      ?.filter((dt) => dt.toLowerCase().includes(searchValue.toLowerCase()))
      .map((dataTypeName: string, index: number) => {
        let type = props.dataTypes[dataTypeName];

        if (typeof props.dataTypes[dataTypeName] === "object") {
          type = props.dataTypes[dataTypeName].type;
        }
        //if the data type is valid for the current dimension, add it to the validDataTypes object
        if (dimensionTypes?.includes(type)) {
          validDataTypes[dataTypeName] = type;
        }
        return null;
      });
    return validDataTypes;
  };

  const getSelectButtonLabel = (
    mappedValues: (string | number)[],
    multiple: boolean
  ) => {
    if (multiple) {
      if (mappedValues.length === 0) {
        return "Select dimension";
      } else {
        return "Select another dimension";
      }
    } else {
      return mappedValues.length > 0 ? mappedValues[0] : "Select dimension";
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        css={`
          width: 100%;
          display: flex;
          flex-direction: column;
          margin-bottom: 30px;
          height: 100%;
        `}
      >
        <ToolboxSubheader
          name="Map datapoints to the chart"
          level={3}
          tooltip="Assign dimensions from your data to suitable axes or parameters in the chart to represent your data."
        />
        <div
          css={`
            width: 90%;
            margin: auto;
            overflow-y: auto;
            height: 100%;
            padding-bottom: 40px;
            max-height: calc(100vh - 260px);
            &::-webkit-scrollbar {
              width: 4px;
              visibility: hidden;
              background: #262c34;
            }
            &::-webkit-scrollbar-track {
              background: #f1f3f5;
              visibility: hidden;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background: #262c34;
              visibility: hidden;
            }
          `}
        >
          <div>
            {isEmpty(props.dimensions) ? (
              <div
                css={`
                  width: 100%;
                `}
              >
                <Box height={16} />
                <DimensionContainerSkeleton />
                <DimensionContainerSkeleton />
              </div>
            ) : (
              <>
                {nonStaticDimensionsState?.map(
                  (dimension: any, dimensionIndex: number) => (
                    <NonStaticDimensionContainer
                      dataTypes={props.dataTypes}
                      key={dimension.id}
                      dimension={dimension}
                      dimensionIndex={dimensionIndex}
                      nonStaticDimensions={nonStaticDimensionsState}
                      handleNonStaticDimensionsUpdate={
                        handleNonStaticDimensionsUpdate
                      }
                      nonStaticDimensionsId={dimension.id}
                      getValidDataTypes={getValidDataTypes}
                      getSelectButtonLabel={getSelectButtonLabel}
                      handleButtonToggle={handleButtonToggle}
                    />
                  )
                )}
                {staticDimensions &&
                  staticDimensions.map((dimension: any) => (
                    <StaticDimensionContainer
                      key={dimension.id}
                      dimension={dimension}
                    />
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

const NonStaticDimensionContainer = (props: {
  dimension: any;
  dimensionIndex: number;
  nonStaticDimensions: any[];
  handleNonStaticDimensionsUpdate: (
    nonStaticDimensionsId: number,
    mappingItemValue: any
  ) => void;
  nonStaticDimensionsId: number;
  dataTypes: any[];
  getValidDataTypes: (dimensionTypes: string[], searchValue: string) => any;
  getSelectButtonLabel: (
    mappedValues: (string | number)[],
    multiple: boolean
  ) => any;
  handleButtonToggle: (id: string) => void;
}) => {
  const [searchValue, setSearchValue] = React.useState("");
  const validTypes = Object.keys(
    props.getValidDataTypes(props.dimension.validTypes, searchValue)
  );

  const [draggingMappingItem, setdraggingMappingItem] = React.useState<{
    isDragging: boolean;
    index: null | number;
  }>({
    isDragging: false,
    index: null,
  });
  const [selectedMappingItemsState, setSelectedMappingItemsState] =
    React.useState<string[]>(props.dimension.mappedValues);

  React.useEffect(() => {
    setSelectedMappingItemsState(props.dimension.mappedValues);
  }, [props.dimension.mappedValues]);

  return (
    <div
      key={`${props.dimension.id}`}
      css={`
        width: 100%;
        padding: 16px 16px 8px 16px;
        height: 100%;
        border-radius: 11px;
        background: #dfe3e5;
        margin-top: 16px;
      `}
      data-cy="nonstatic-dimension-container"
    >
      <div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 4px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              width: 72px;
              opacity: 0.5;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 5px;
              p {
                margin: 0;
              }
              svg {
                margin-top: 6px;
              }
            `}
          >
            {props.dimension.validTypes.map(
              (type: "string" | "number" | "date") => (
                <p key={type}>{typeIcon[type]}</p>
              )
            )}
          </div>
          <div
            css={`
              font-size: 14px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;

              color: #262c34;
            `}
          >
            {props.dimension.name}
          </div>
          <div
            css={`
              width: 72px;
              color: #ef1320;
              font-size: 32px;
              text-align: right;
              margin-bottom: -12px;
              visibility: ${props.dimension.required ? "visible" : "hidden"};
            `}
          >
            *
          </div>
        </div>

        {selectedMappingItemsState.map(
          (mappingItemValue: string, index: number) => {
            let type = props.getValidDataTypes(props.dimension.validTypes, "")[
              mappingItemValue
            ];

            return (
              <div key={mappingItemValue}>
                {index === 0 && (
                  <DropPlaceholder
                    placeholderIndex={0}
                    dimension={props.dimension}
                    draggingState={draggingMappingItem}
                  />
                )}
                <ChartToolBoxMappingItem
                  key={mappingItemValue}
                  testId={`mapping-item-${mappingItemValue}`}
                  type={type}
                  index={index}
                  marginBottom={"3px"}
                  mappingItemValue={mappingItemValue}
                  dimension={props.dimension}
                  handleNonStaticDimensionsUpdate={
                    props.handleNonStaticDimensionsUpdate
                  }
                  dataTypes={props.dataTypes}
                  nonStaticDimensionsId={props.dimension.id}
                  nonStaticDimensionsIndex={props.dimensionIndex}
                  nonStaticDimensions={props.nonStaticDimensions}
                  displayCloseButton
                  showAggregation
                  handleButtonToggle={props.handleButtonToggle}
                  setdraggingMappingItem={setdraggingMappingItem}
                  mapSize={selectedMappingItemsState.length}
                />
                <DropPlaceholder
                  placeholderIndex={index + 1}
                  dimension={props.dimension}
                  draggingState={draggingMappingItem}
                />
              </div>
            );
          }
        )}
        <DimensionSelect
          dimension={props.dimension}
          getSelectButtonLabel={props.getSelectButtonLabel}
          handleButtonToggle={props.handleButtonToggle}
          selectedMappingItems={props.dimension.mappedValues}
          index={0}
        />
      </div>
      {props.dimension?.mapValuesDisplayed && (
        <div
          css={`
            height: 100%;
            overflow-y: scroll;
            max-height: 253px;

            ::-webkit-scrollbar {
              width: 0px;
              display: none;
            }
          `}
          data-cy="chart-dimension-mapping-container"
        >
          <div
            css={`
              display: flex;
              align-items: center;
              width: 100%;
              background: #f1f3f5;
              border-radius: 24px;
              height: 31px;
              padding-right: 5px;

              margin-bottom: 12px;

              input {
                border: none;
                background: transparent;
                width: 90%;
                height: 100%;
                padding-left: 16px;
              }
            `}
          >
            <input
              type="text"
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
            />
            <SearchIcon htmlColor="#868E96" />
          </div>

          {validTypes?.map((mappingItemValue: string, index: number) => {
            const type = props.getValidDataTypes(
              props.dimension.validTypes,
              searchValue
            )[mappingItemValue];

            return (
              <ChartToolBoxMappingItem
                key={mappingItemValue}
                testId={`mapping-item-${mappingItemValue}`}
                type={type}
                index={index}
                marginBottom="16px"
                mappingItemValue={mappingItemValue}
                dimension={props.dimension}
                handleNonStaticDimensionsUpdate={
                  props.handleNonStaticDimensionsUpdate
                }
                mapSize={validTypes.length}
                dataTypes={props.dataTypes}
                nonStaticDimensionsId={props.dimension.id}
                nonStaticDimensionsIndex={props.dimensionIndex}
                nonStaticDimensions={props.nonStaticDimensions}
                showAggregation={false}
                setdraggingMappingItem={() => {}}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

const DimensionSelect = (props: {
  dimension: any;
  getSelectButtonLabel: (
    mappedValues: (string | number)[],
    multiple: boolean
  ) => any;
  handleButtonToggle: (id: string) => void;
  index: number;
  selectedMappingItems: string[];
}) => {
  return (
    <>
      {!!props.dimension?.multiple ||
      isEmpty(props.selectedMappingItems) ||
      isEmpty(props.dimension.mappedValues) ? (
        <div
          css={`
            > span {
              font-size: 14px;
            }
          `}
        >
          <Button
            disableTouchRipple
            onClick={() => props.handleButtonToggle(props.dimension.id)}
            css={mappingStyles.selectedButtoncss(props.dimension)}
            data-cy="chart-dimension-select"
          >
            <span
              css={`
                text-align: center;
                width: 100%;
              `}
            >
              {props.getSelectButtonLabel(
                props.dimension.mappedValues,
                !!props.dimension?.multiple
              )}
            </span>
            <ArrowDropUpIcon
              css={`
                margin-right: -7px;
              `}
            />
          </Button>
        </div>
      ) : null}
    </>
  );
};

function ChartToolBoxMappingItem(
  props: Readonly<ChartToolBoxMappingItemProps>
) {
  const { dimension, dataTypes } = props;
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const removeMappingValue = useStoreActions(
    (state) => state.charts.mapping.removeMappingValue
  );

  const columnDataType = getTypeName(dataTypes[props.mappingItemValue as any]);

  const handleClick = () => {
    //checking for props.aggregation cos it's only true for selected dimesions
    if (props.showAggregation) {
      props.handleButtonToggle?.(props.dimension?.id);
      return;
    }
    const isValid =
      dimension.validTypes?.length === 0 ||
      dimension.validTypes?.includes(columnDataType);

    if (!isValid) {
      return;
    }
    props.handleNonStaticDimensionsUpdate(
      props.nonStaticDimensionsId,
      props.mappingItemValue
    );

    const mappingFromStorage = get(
      JSON.parse(
        sessionStorage.getItem("[EasyPeasyStore][0][charts.mapping]") ?? ""
      ),
      "data.value",
      {}
    ) as { [key: string]: any };

    const localDimensionMapping = get(mappingFromStorage, dimension.id, {});

    const defaulAggregation = dimension.aggregation
      ? getDefaultDimensionAggregation(
          dimension,
          dataTypes[props.mappingItemValue as any]
        )
      : null;

    if (
      props.nonStaticDimensions[props.nonStaticDimensionsIndex].mappedValues &&
      !props.nonStaticDimensions[props.nonStaticDimensionsIndex]?.multiple
    ) {
      //replace mapping
      setMapping({
        [dimension.id]: {
          ids: [props.mappingItemValue],
          value: [props.mappingItemValue],
          isValid: isValid,
          mappedType: columnDataType,
          config: dimension.aggregation
            ? {
                aggregation: [defaulAggregation],
              }
            : undefined,
        },
      });
    } else {
      setMapping({
        [dimension.id]: {
          ids: (localDimensionMapping.ids || []).concat(props.mappingItemValue),
          value: [
            ...(localDimensionMapping.value || []),
            props.mappingItemValue,
          ],
          isValid: isValid,
          mappedType: columnDataType,
          config: dimension.aggregation
            ? {
                aggregation: [
                  ...(get(localDimensionMapping, "config.aggregation") || []),
                  defaulAggregation,
                ],
              }
            : undefined,
        },
      });
    }
  };

  const onDeleteItem = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    removeMappingValue({ id: dimension.id, value: props.mappingItemValue });
  };

  const aggregators = getAggregatorNames();

  const dimensionMapping = get(mapping, props.dimension.id, {});
  const setAggregation = React.useCallback(
    (newAggregations) => {
      setMapping({
        [props.dimension.id]: {
          ...dimensionMapping,
          config: {
            aggregation: [...newAggregations],
          },
        },
      });
    },
    [mapping, setMapping, dimensionMapping]
  );

  const onChangeAggregation = React.useCallback(
    (i, aggregatorName) => {
      const aggregationsMappedHere = get(
        mapping,
        `${props.dimension.id}.config.aggregation`,
        []
      );
      const newAggregations = [...aggregationsMappedHere];
      newAggregations[i] = aggregatorName;
      setAggregation(newAggregations);
    },
    [mapping, setAggregation]
  );
  const relatedAggregation = React.useMemo(() => {
    if (props.dimension?.aggregation) {
      return dimensionMapping.config?.aggregation[props.index] || "sum";
    } else {
      return null;
    }
  }, [props.dimension, props.index, dimensionMapping]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: MAPPING_ITEM_TYPE,
    item: { dragIndex: props.index, value: props.mappingItemValue },
    collect: (monitor) => {
      return { isDragging: !!monitor.isDragging() };
    },
  }));

  React.useEffect(() => {
    props.setdraggingMappingItem({ isDragging, index: props.index });
  }, [isDragging]);

  const styleParams = {
    backgroundColor: props.backgroundColor,
    marginBottom: props.marginBottom,
    isDragging: isDragging,
    dimension: props.dimension,
    mappingItemValue: props.mappingItemValue,
    elevate: props.displayCloseButton && !!props.dimension?.aggregation,
    elevationIndex: props.mapSize ? props.mapSize - props.index : 0,
  };
  return (
    <div
      key={props.mappingItemValue}
      id={props.testId}
      css={mappingStyles.mappingItemcss(styleParams)}
      onClick={handleClick}
      data-cy="chart-dimension-mapping-item"
      ref={props.dimension.multiple ? drag : undefined}
    >
      <div>
        <p>{typeIcon[props.type]}</p>

        <p
          css={`
            overflow: clip;
            font-size: 14px;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: calc(100% - 40px);
            text-transform: capitalize;
          `}
        >
          {props.mappingItemValue}
        </p>
      </div>

      {props.displayCloseButton && (
        <IconButton onClick={onDeleteItem}>
          <CloseIcon htmlColor="#fff" fontSize="small" />
        </IconButton>
      )}

      {props.showAggregation &&
        props.dimension &&
        !!props.dimension?.aggregation &&
        props.dimension.mappedValues.length > 0 &&
        relatedAggregation &&
        aggregators && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Dropdown
              className="d-inline-block ml-2 raw-dropdown"
              id="rb-dropdown-menu"
              css={`
                margin-right: -7px;
                position: absolute;
                right: 55px;
                top: 2px;
              `}
            >
              <Dropdown.Toggle
                css={`
                  width: 110px;
                  color: #262c34;
                  font-size: 14px;
                  border-style: none;
                  border-radius: 26px;
                  padding-right: 16px;
                  background: #cfd4da;
                  box-shadow: none !important;

                  &:hover,
                  &:active,
                  &:focus {
                    color: #262c34;
                    background: #cfd4da;
                  }
                `}
              >
                {get(
                  AGGREGATIONS_LABELS,
                  relatedAggregation,
                  relatedAggregation
                )}
              </Dropdown.Toggle>

              <Dropdown.Menu
                css={`
                  min-width: 110px;
                  background: #dfe3e6;
                  border-radius: 13px;
                  box-shadow: none !important;
                  overflow: scroll;
                `}
              >
                {aggregators.map((aggregatorName: string) => (
                  <Dropdown.Item
                    key={aggregatorName}
                    onClick={() =>
                      onChangeAggregation &&
                      onChangeAggregation(props.index, aggregatorName)
                    }
                    css={`
                      color: #262c34;
                      font-size: 14px;
                      padding: 6px 12px !important;
                      border-bottom: 1px solid rgba(173, 181, 189, 0.5);
                    `}
                  >
                    {get(AGGREGATIONS_LABELS, aggregatorName, aggregatorName)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        )}
    </div>
  );
}

function DropPlaceholder(props: {
  placeholderIndex: number;
  dimension: any;
  draggingState: { isDragging: boolean; index: null | number };
}) {
  const isDroppable = () => {
    if (props.draggingState.isDragging) {
      if (props.draggingState.index === -1) {
        return true;
      }
      if (props.placeholderIndex === props.draggingState.index) {
        return false;
      }
      return props.placeholderIndex - 1 !== props.draggingState.index;
    }
    return false;
  };
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const [{ isOver, handlerId, canDrop, item }, drop] = useDrop(
    () => ({
      accept: MAPPING_ITEM_TYPE,
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
        item: monitor.getItem(),
        handlerId: monitor.getHandlerId(),
      }),

      drop: (item: any, monitor) => {
        setMapping({
          ...mapping,
          [props.dimension.id]: {
            ...mapping[props.dimension.id],
            ids: moveMappingItem(
              mapping[props.dimension.id].ids,
              item.dragIndex,
              props.placeholderIndex,
              item
            ),
            value: moveMappingItem(
              mapping[props.dimension.id].value,
              item.dragIndex,
              props.placeholderIndex,
              item
            ),
          },
        });
      },
    }),
    [mapping]
  );

  return (
    <div
      ref={drop}
      data-handler-id={handlerId}
      css={`
        background: ${isOver ? "#231d2c" : "#fff"};
        width: 100%;
        height: 31px;
        margin-bottom: 3px;
        border-radius: 25px;
        border: 1px dashed #231d2c;
        opacity: 0.5;
        display: ${isDroppable() ? "block" : "none"};
      `}
    />
  );
}

const moveMappingItem = (
  arr: any,
  dragIndex: number,
  dropIndex: number,
  item: any
) => {
  const newState = [...arr];
  const isDragPositionHigher = dragIndex > dropIndex;
  newState.splice(dropIndex, 0, item.value);
  const removeIndex = isDragPositionHigher ? dragIndex + 1 : dragIndex;
  newState.splice(removeIndex, 1);
  return newState;
};

const StaticDimensionContainer = (props: { dimension: any }) => {
  const mapping = useStoreState((state) => state.charts.mapping.value);
  const setMapping = useStoreActions(
    (actions) => actions.charts.mapping.setValue
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const loadedChartMappingValue = get(
    loadedChart,
    `mapping.${props.dimension.id}.value[0]`,
    ""
  );
  const mainKPImetric = props.dimension.id === "mainKPImetric";
  const [valueCount, setValueCount] = React.useState(0);
  const [value, setValue] = React.useState(
    //for the case of BNC, mapping doesn't come with complete values, hence we fallback to the loaded chart mapping.
    //TODO: replace loadedChartMappingValue with ""  when mapping for BNC is fixed
    get(mapping, `${props.dimension.id}.value[0]`, loadedChartMappingValue)
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (mainKPImetric) {
      const re = /^[0-9\b+-]+$/;
      if (e.target.value === "" || re.test(e.target.value)) {
        setValue(e.target.value);
        setValueCount(e.target.value.length);
      }
    } else {
      setValue(e.target.value);
      setValueCount(e.target.value.length);
    }
  };

  const onValueChange = (value: string) => {
    const mappingFromStorage = get(
      JSON.parse(
        sessionStorage.getItem("[EasyPeasyStore][0][charts.mapping]") ?? ""
      ),
      "data.value",
      {}
    ) as { [key: string]: any };
    const localDimensionMapping = get(
      mappingFromStorage,
      props.dimension.id,
      {}
    );
    setMapping({
      [props.dimension.id]: {
        ids: (localDimensionMapping.ids || []).concat(uniqueId()),
        value: [value],
        isValid: true,
        mappedType: mainKPImetric ? "number" : "string",
      },
    });
  };
  const [,] = useDebounce(() => onValueChange(value), 1000, [value]);
  return (
    <div
      data-cy="static-dimension-container"
      key={`${props.dimension.id}`}
      css={`
        width: 100%;
        padding: 16px 16px 8px 16px;
        height: 100%;
        overflow-y: hidden;
        border-radius: 11px;
        background: #dfe3e5;
        margin-top: 16px;
      `}
    >
      <div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 4px;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={`
              width: 72px;
              opacity: 0.5;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 5px;
              p {
                margin: 0;
              }
              svg {
                margin-top: 6px;
              }
            `}
          >
            <p>{mainKPImetric ? typeIcon["number"] : typeIcon["string"]}</p>
          </div>
          <div
            css={`
              font-size: 14px;
              color: #262c34;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            `}
          >
            {props.dimension.name}
          </div>
          <div
            css={`
              width: 72px;
              color: #ef1320;
              font-size: 32px;
              text-align: right;
              margin-bottom: -12px;
              visibility: ${props.dimension.required ? "visible" : "hidden"};
            `}
          >
            *
          </div>
        </div>
      </div>
      <div
        css={`
          position: relative;
        `}
      >
        <textarea
          value={value}
          onChange={handleInputChange}
          maxLength={mainKPImetric ? 6 : 50}
          minLength={mainKPImetric ? 1 : 6}
          css={`
            width: 100%;
            min-height: 40px;
            resize: vertical;
            padding: 14px 8px;
            border-radius: 11px;
            border: 1px solid #231d2c;
          `}
        />
        <span
          css={`
            position: absolute;
            bottom: 4px;
            right: 13px;
            font-size: 12px;
          `}
        >
          {valueCount}/{mainKPImetric ? "6" : "50"}
        </span>
      </div>
      <div
        css={`
          color: #231d2c;
          font-size: 12px;
          margin-top: 2px;
          font-weight: 400;
          line-height: 15px;
        `}
      >
        {mainKPImetric
          ? "The main KPI metric must be between 0 and 6 characters in length. Main KPI metric will overwrite content from the dataset."
          : `The ${props.dimension.name} must be between 6 and 50 characters in
        length.`}
      </div>
    </div>
  );
};
