import React from "react";
import { AssetType } from "./assetsGrid";

import ChartGridItem from "app/modules/home-module/components/AssetCollection/Charts/gridItem";
import DatasetGridItem from "app/modules/home-module/components/AssetCollection/Datasets/gridItem";
import StoryGridItem from "app/modules/home-module/components/AssetCollection/Stories/gridItem";
import ColoredStoryIcon from "app/assets/icons/ColoredStoryIcon";
import { EditorState, convertFromRaw } from "draft-js";
import { coloredEchartTypes } from "app/modules/chart-module/routes/chart-type/data";
import { find } from "lodash";
import { echartTypes } from "app/modules/chart-module/routes/chart-type/data";

export default function RenderAsset(props: {
  data: any;
  activeAssetType: AssetType;
  handleModal: (id: string) => void;
  handleDuplicate: (id: string, assetType: AssetType) => void;
  setActiveAssetType: (assetType: AssetType) => void;
  inChartBuilder?: boolean;
}) {
  const {
    data,
    activeAssetType,
    handleDuplicate,
    handleModal,
    setActiveAssetType,
  } = props;

  const getIcon = (vizType: string) => {
    const type = find(coloredEchartTypes(), { id: vizType });
    if (type) {
      return type.icon;
    }
    return coloredEchartTypes()[0].icon;
  };

  switch (activeAssetType) {
    case "chart":
      return (
        <ChartGridItem
          id={data.id}
          title={data.name}
          date={data.updatedDate}
          viz={getIcon(data.vizType)}
          vizType={data.vizType}
          isMappingValid={data.isMappingValid}
          handleDelete={() => {
            setActiveAssetType(data.assetType as AssetType);
            handleModal(data.id);
          }}
          handleDuplicate={() =>
            handleDuplicate(data.id, data.assetType as AssetType)
          }
          owner={data.owner}
          isAIAssisted={data.isAIAssisted}
          ownerName={data.ownerName.split(" ")[0]}
        />
      );

    case "dataset":
      return (
        <DatasetGridItem
          editPath={`/dataset/${data.id}/edit`}
          title={data.name}
          date={data.updatedDate}
          handleDelete={() => {
            setActiveAssetType(data.assetType as AssetType);
            handleModal(data.id);
          }}
          descr={data.description}
          handleDuplicate={() => {
            handleDuplicate(data.id, data.assetType as AssetType);
          }}
          showMenu={!props.inChartBuilder}
          id={data.id}
          owner={data.owner}
          inChartBuilder={props.inChartBuilder as boolean}
          ownerName={data.ownerName.split(" ")[0]}
          source={data.source}
          sourceURL={data.sourceUrl}
        />
      );

    case "story":
      return (
        <StoryGridItem
          id={data.id}
          key={data.id}
          name={data.name}
          date={data.updatedDate}
          viz={<ColoredStoryIcon />}
          color={data.backgroundColor}
          handleDelete={() => {
            setActiveAssetType(data.assetType as AssetType);
            handleModal(data.id);
          }}
          handleDuplicate={() =>
            handleDuplicate(data.id, data.assetType as AssetType)
          }
          heading={
            data.heading
              ? EditorState.createWithContent(convertFromRaw(data.heading))
              : EditorState.createEmpty()
          }
          owner={data.owner}
          ownerName={data.ownerName.split(" ")[0]}
        />
      );
  }
}

export const renderAssetTableData = (data: any, activeAssetType: string) => {
  switch (activeAssetType) {
    case "chart":
      return {
        id: data.id,
        name: data.name,
        description: data.title,
        updatedDate: data.updatedDate,
        createdDate: data.createdDate,
        type: data.assetType.toLowerCase(),
        ownerName: data.ownerName.split(" ")[0],
        vizType: echartTypes(false).find((e) => e.id === data.vizType)?.label,
      };
    case "dataset":
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        updatedDate: data.updatedDate,
        createdDate: data.createdDate,
        type: data.assetType.toLowerCase() /* as keyof IDataTypeMap */,
        ownerName: data.ownerName.split(" ")[0],
      };
    case "story":
      return {
        id: data.id,
        name: data.name,
        description: data.heading
          ? EditorState.createWithContent(convertFromRaw(data.heading))
              .getCurrentContent()
              .getPlainText()
          : EditorState.createEmpty().getCurrentContent().getPlainText(),
        updatedDate: data.updatedDate,
        createdDate: data.createdDate,
        type: data.assetType.toLowerCase(),

        ownerName: data.ownerName.split(" ")[0],
      };
  }
};
