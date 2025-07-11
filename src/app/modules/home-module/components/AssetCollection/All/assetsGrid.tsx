/* third party */
import React from "react";
import axios from "axios";
import get from "lodash/get";
import find from "lodash/find";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { useUpdateEffect } from "react-use";
/* project */
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import CircleLoader from "app/modules/home-module/components/Loader";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import {
  coloredEchartTypes,
  echartTypes,
} from "app/modules/chart-module/routes/chart-type/data";
import ChartGridItem from "app/modules/home-module/components/AssetCollection/Charts/gridItem";
import DatasetGridItem from "app/modules/home-module/components/AssetCollection/Datasets/gridItem";
import StoryGridItem from "app/modules/home-module/components/AssetCollection/Stories/gridItem";
import ColoredStoryIcon from "app/assets/icons/ColoredStoryIcon";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import DeleteStoryDialog from "app/components/Dialogs/deleteStoryDialog";
import { EditorState, convertFromRaw } from "draft-js";
import { getLimit } from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import { HomepageTable } from "app/modules/home-module/components/Table/";
import { planDialogAtom } from "app/state/recoil/atoms";
import { useSetRecoilState } from "recoil";
import { getColumns } from "app/modules/home-module/components/AssetCollection/All/data";

interface Props {
  sortBy: string;
  searchStr: string;
  userOnly?: boolean;
  view: "grid" | "table";
  inChartBuilder?: boolean;
  category?: string;
  onItemClick?: (v: string) => void;
  md?: GridSize;
  lg?: GridSize;
  noAuth?: boolean;
}
export type assetType = "chart" | "dataset" | "story";

export default function AssetsGrid(props: Props) {
  const observerTarget = React.useRef(null);
  const [cardId, setCardId] = React.useState<string>("");
  const [loadedAssets, setLoadedAssets] = React.useState<any[]>([]);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [activeAssetType, setActiveAssetType] =
    React.useState<assetType | null>(null);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const initialRender = React.useRef(true);

  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const token = useStoreState((state) => state.AuthToken.value);

  const limit = getLimit();
  const [offset, setOffset] = React.useState(0);

  const { isObserved } = useInfinityScroll(observerTarget);

  const assets = useStoreState(
    (state) => (state.assets.AssetGetList.crudData ?? []) as any[]
  );
  const loadAssets = useStoreActions(
    (actions) => actions.assets.AssetGetList.fetch
  );
  const loadAssetsCount = useStoreActions(
    (actions) => actions.assets.AssetsCount.fetch
  );
  const assetsCount = useStoreState(
    (state) => get(state, "assets.AssetsCount.data.count", 0) as number
  );

  // const loadAssets = useStoreActions(
  //   (actions) => actions.assets.AssetGetList.fetch
  // );

  const loading = useStoreState((state) => state.assets.AssetGetList.loading);

  const assetsLoadSuccess = useStoreState(
    (state) => state.assets.AssetGetList.success
  );

  const getFilterString = (fromZeroOffset?: boolean) => {
    const value =
      props.searchStr?.length > 0
        ? `"where":{"name":{"like":"${props.searchStr}.*","options":"i"}},`
        : "";

    return `${props.userOnly ? "userOnly=true&" : ""}filter={${value}"order":"${
      props.sortBy
    } ${props.sortBy === "name" ? "asc" : "desc"}","limit":${limit},"offset":${
      fromZeroOffset ? 0 : offset
    }}`;
  };

  const getWhereString = () => {
    const value =
      props.searchStr?.length > 0
        ? `where={"name":{"like":"${props.searchStr}.*","options":"i"}}`
        : "";
    return `${props.userOnly ? "userOnly=true&" : ""}${value}`;
  };

  const loadData = (fromZeroOffset?: boolean) => {
    if (token) {
      loadAssets({
        token,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    } else {
      loadAssets({
        nonAuthCall: true,
        storeInCrudData: true,
        filterString: getFilterString(fromZeroOffset),
      });
    }
  };

  const reloadData = () => {
    if (token) {
      loadAssetsCount({ token, filterString: getWhereString() });
    } else {
      loadAssetsCount({ nonAuthCall: true, filterString: getWhereString() });
    }
    setLoadedAssets([]);
    setOffset(0);

    loadData(true);
  };

  React.useEffect(() => {
    //load data if intersection observer is triggered
    if (
      assetsCount > limit &&
      isObserved &&
      assetsLoadSuccess &&
      loadedAssets.length !== assetsCount &&
      !props.noAuth
    ) {
      //update the offset value for the next load

      setOffset(offset + limit);
    }
  }, [isObserved]);

  useUpdateEffect(() => {
    if (offset === 0) {
      return;
    }
    loadData();
  }, [offset, token]);

  const handleDelete = (id: string) => {
    setModalDisplay(false);
    setEnableButton(false);

    console.log(activeAssetType);

    if (!id) {
      return;
    }

    const url = {
      chart: `${process.env.REACT_APP_API}/chart/${id}`,
      dataset: `${process.env.REACT_APP_API}/datasets/${id}`,
      story: `${process.env.REACT_APP_API}/story/${id}`,
    }[activeAssetType as assetType];

    axios
      .delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        reloadData();
        setActiveAssetType(null);
      })
      .catch((error) => console.log(error));
  };

  const handleDuplicate = (id: string, assettype: assetType) => {
    if (!id) {
      return;
    }
    const url = {
      chart: `${process.env.REACT_APP_API}/chart/duplicate/${id}`,
      dataset: `${process.env.REACT_APP_API}/dataset/duplicate/${id}`,
      story: `${process.env.REACT_APP_API}/story/duplicate/${id}`,
    }[assettype];
    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        if (response.data.planWarning) {
          setPlanDialog({
            open: true,
            message: response.data.planWarning,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        reloadData();
      })
      .catch((error) => console.log(error));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleModal = (id: string) => {
    setCardId(id);
    setModalDisplay(true);
  };

  const getIcon = (vizType: string) => {
    const type = find(coloredEchartTypes(), { id: vizType });
    if (type) {
      return type.icon;
    }
    return coloredEchartTypes()[0].icon;
  };

  React.useEffect(() => {
    if (!assetsLoadSuccess) {
      return;
    }
    //update the loaded stories
    setLoadedAssets((prevAssets) => {
      const prevAssetsIds = prevAssets.map((c) => c.id);
      const f = assets.filter((asset) => !prevAssetsIds.includes(asset.id));
      return [...prevAssets, ...f];
    });
  }, [assetsLoadSuccess]);

  React.useEffect(() => {
    reloadData();
  }, [props.sortBy, token, props.userOnly]);

  const [,] = useDebounce(
    () => {
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }
      reloadData();
    },
    500,
    [props.searchStr]
  );

  return (
    <>
      {props.view === "table" ? (
        <HomepageTable
          onItemClick={props.onItemClick}
          inChartBuilder={props.inChartBuilder}
          all
          handleDelete={handleModal}
          handleDuplicate={handleDuplicate}
          setActiveAssetType={setActiveAssetType}
          tableData={{
            columns: getColumns(),
            data: loadedAssets.map((data) => {
              if (data.assetType === "chart") {
                return {
                  id: data.id,
                  name: data.name,
                  description: data.title,
                  updatedDate: data.updatedDate,
                  type: data.assetType,
                  owner: data.owner,
                  vizType: echartTypes(false).find((e) => e.id === data.vizType)
                    ?.label,
                };
              } else if (data.assetType === "dataset") {
                return {
                  id: data.id,
                  name: data.name,
                  description: data.description,
                  updatedDate: data.updatedDate,
                  type: data.assetType,
                  owner: data.owner,
                };
              }
              return {
                id: data.id,
                name: data.name,
                heading: data.heading
                  ? EditorState.createWithContent(convertFromRaw(data.heading))
                  : EditorState.createEmpty(),
                updatedDate: data.updatedDate,
                type: data.assetType,
                owner: data.owner,
              };
            }),
          }}
        />
      ) : (
        <Grid container spacing={2}>
          {loadedAssets.map((d, index) => (
            <Grid item key={d.id} xs={12} sm={6} md={4} lg={3}>
              {
                {
                  chart: (
                    <ChartGridItem
                      id={d.id}
                      title={d.name}
                      date={d.updatedDate}
                      viz={getIcon(d.vizType)}
                      vizType={d.vizType}
                      isMappingValid={d.isMappingValid}
                      handleDelete={() => {
                        setActiveAssetType(d.assetType as assetType);
                        handleModal(d.id);
                      }}
                      handleDuplicate={() =>
                        handleDuplicate(d.id, d.assetType as assetType)
                      }
                      owner={d.owner}
                      isAIAssisted={d.isAIAssisted}
                      ownerName={d.ownerName ?? ""}
                    />
                  ),
                  dataset: (
                    <DatasetGridItem
                      path={`/dataset/${d.id}/edit`}
                      title={d.name}
                      date={d.updatedDate}
                      handleDelete={() => {
                        setActiveAssetType(d.assetType as assetType);
                        handleModal(d.id);
                      }}
                      descr={d.description}
                      handleDuplicate={() => {
                        handleDuplicate(d.id, d.assetType as assetType);
                      }}
                      showMenu={!props.inChartBuilder}
                      id={d.id}
                      owner={d.owner}
                      inChartBuilder={props.inChartBuilder as boolean}
                      ownerName={d.ownerName ?? ""}
                    />
                  ),
                  story: (
                    <StoryGridItem
                      id={d.id}
                      key={d.id}
                      name={d.name}
                      date={d.updatedDate}
                      viz={<ColoredStoryIcon />}
                      color={d.backgroundColor}
                      handleDelete={() => {
                        setActiveAssetType(d.assetType as assetType);
                        handleModal(d.id);
                      }}
                      handleDuplicate={() =>
                        handleDuplicate(d.id, d.assetType as assetType)
                      }
                      heading={
                        d.heading
                          ? EditorState.createWithContent(
                              convertFromRaw(d.heading)
                            )
                          : EditorState.createEmpty()
                      }
                      owner={d.owner}
                      ownerName={d.ownerName ?? ""}
                    />
                  ),
                }[d.assetType as assetType]
              }

              <Box height={16} />
            </Grid>
          ))}
        </Grid>
      )}

      <Box height={80} />

      <div ref={observerTarget} />
      {loading && <CircleLoader />}

      {
        {
          chart: (
            <DeleteChartDialog
              cardId={cardId}
              modalDisplay={modalDisplay}
              enableButton={enableButton}
              handleDelete={handleDelete}
              setModalDisplay={setModalDisplay}
              handleInputChange={handleInputChange}
            />
          ),
          dataset: (
            <DeleteDatasetDialog
              cardId={cardId}
              enableButton={enableButton}
              handleDelete={handleDelete}
              modalDisplay={modalDisplay}
              setModalDisplay={setModalDisplay}
              setEnableButton={setEnableButton}
            />
          ),
          story: (
            <DeleteStoryDialog
              cardId={cardId}
              modalDisplay={modalDisplay}
              enableButton={enableButton}
              handleDelete={handleDelete}
              setModalDisplay={setModalDisplay}
              handleInputChange={handleInputChange}
            />
          ),
        }[activeAssetType as assetType]
      }
    </>
  );
}
