import React from "react";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { useRecoilState, useRecoilValue } from "recoil";
import find from "lodash/find";
import {
  chartFromStoryAtom,
  isChartDraggingAtom,
} from "app/state/recoil/atoms";
import { useDrag } from "react-dnd";
import { Charts } from "./data";
import GridItem from "app/modules/story-module/components/right-panel-create-view/rhpGridItem";

export default function ChartItem(
  props: Readonly<{
    id: string;
    chartIndex: number;
    name: string;
    vizType: string;
    datasetId: string;
    createdDate: string;
    elementType: "chart" | "bigNumber";
    framesArray: IFramesArray[];
    isAIAssistedChart: boolean;
  }>
) {
  const [chartPreview, setChartPreview] = React.useState(false);
  const chartFromStory = useRecoilValue(chartFromStoryAtom);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: props.elementType,
    item: {
      type: props.elementType,
      value: props.id,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const getIcon = (vizType: string) => {
    const type = find(Charts, { id: vizType });
    if (type) {
      return type.icon;
    }
    return Charts[0].icon;
  };

  let added = false;
  for (let i = 0; i < props.framesArray.length; i++) {
    if (props.framesArray[i].content.includes(props.id)) {
      added = true;
    }
  }

  const setIsChartDragging = useRecoilState(isChartDraggingAtom)[1];

  React.useEffect(() => {
    if (isDragging && !added) {
      setIsChartDragging(props.elementType);
    } else {
      setIsChartDragging(null);
    }
  }, [isDragging]);

  return (
    <div
      ref={drag}
      id={`chart-${props.chartIndex}`}
      data-testid={props.chartIndex === 0 ? "chart-0" : "chart-n"}
      className={
        props.chartIndex === 0 &&
        chartFromStory.action === "create" &&
        chartFromStory.chartId === props.id
          ? "rhcpCard"
          : ""
      }
      css={`
        width: 100%;
        font-size: 12px;
        background: #fff;
        user-select: none;
        cursor: grab;
        &:hover {
          box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.25);
        }
        > div {
          width: 100%;
        }
      `}
      data-cy="story-panel-chart-item"
    >
      <GridItem
        id={props.id}
        path={props.name}
        title={props.name}
        date={props.createdDate}
        viz={getIcon(props.vizType)}
        added={added}
        chartPreview={chartPreview}
        setChartPreview={setChartPreview}
        isAIAssistedChart={props.isAIAssistedChart}
        descr="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </div>
  );
}
