/* third party */
import React from "react";
import axios from "axios";
import get from "lodash/get";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";
import useDebounce from "react-use/lib/useDebounce";
import { useUpdateEffect } from "react-use";
/* project */
import { useInfinityScroll } from "@app/hooks/useInfinityScroll";
import CircleLoader from "@app/modules/home-module/components/Loader";
import { useStoreActions, useStoreState } from "@app/state/store/hooks";
import DeleteChartDialog from "@app/components/Dialogs/deleteChartDialog";
import DeleteDatasetDialog from "@app/components/Dialogs/deleteDatasetDialog";
import DeleteStoryDialog from "@app/components/Dialogs/deleteStoryDialog";
import { getLimit } from "@app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import { HomepageTable } from "@app/modules/home-module/components/Table/";
import { planDialogAtom } from "@app/state/recoil/atoms";
import { useSetRecoilState } from "recoil";
import { getColumns } from "@app/modules/home-module/components/AssetCollection/All/data";
import RenderAsset, { renderAssetTableData } from "./renderAsset";
import { updateLog } from "@app/utils/updateLog";

interface Props {
  sortBy: string;
  searchStr: string;
  filterValue?: "allAssets" | "myAssets" | "dataxplorerAssets";
  gridId: string;
  view: "grid" | "table";
  inChartBuilder?: boolean;
  category?: string;
  onItemClick?: (v: string) => void;
  md?: GridSize;
  lg?: GridSize;
  noAuth?: boolean;
  selectActive?: boolean;
  allChartsSelected?: boolean;
  allDatasetsSelected?: boolean;
  allStoriesSelected?: boolean;
  selectedItems: { assetType: string; id: string }[];
  setSelectedItems: (items: { assetType: string; id: string }[]) => void;
}
export type AssetType = "chart" | "dataset" | "story";

export default function AssetsGrid(props: Props) {
  const observerTarget = React.useRef(null);
  const [cardId, setCardId] = React.useState<string>("");
  const [loadedAssets, setLoadedAssets] = React.useState<any[]>([]);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [activeAssetType, setActiveAssetType] =
    React.useState<AssetType | null>(null);
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

  const loading = useStoreState((state) => state.assets.AssetGetList.loading);

  const assetsLoadSuccess = useStoreState(
    (state) => state.assets.AssetGetList.success
  );

  const getFilterString = (fromZeroOffset?: boolean) => {
    try {
      updateLog({
        level: "info",
        message: "Getting filter string for assets grid",
      }).catch((err) => {
        console.error("Logging error:", err);
      });
      const value =
        props.searchStr?.length > 0
          ? `"where":{"name":{"like":"${props.searchStr}.*","options":"i"}},`
          : "";

      return `filterValue=${props.filterValue}&filter={${value}"order":"${
        props.sortBy
      } ${
        props.sortBy === "name" ? "asc" : "desc"
      }","limit":${limit},"offset":${fromZeroOffset ? 0 : offset}}`;
    } catch (error) {
      updateLog({
        level: "error",
        message: `Error getting filter string for assets grid: ${error}`,
      });
      return ``;
    }
  };

  const getWhereString = () => {
    try {
      updateLog({
        level: "info",
        message: "Getting where string for assets grid",
      }).catch((err) => {
        console.error("Logging error:", err);
      });
      const value =
        props.searchStr?.length > 0
          ? `where={"name":{"like":"${props.searchStr}.*","options":"i"}}`
          : "";
      return `filterValue=${props.filterValue}&${value}`;
    } catch (error) {
      updateLog({
        level: "error",
        message: `Error getting where string for assets grid: ${error}`,
      });
      return ``;
    }
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

    if (!id) {
      return;
    }

    const url = {
      chart: `${import.meta.env.VITE_API}/chart/${id}`,
      dataset: `${import.meta.env.VITE_API}/datasets/${id}`,
      story: `${import.meta.env.VITE_API}/story/${id}`,
    }[activeAssetType as AssetType];

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

  const handleDuplicate = (id: string, assettype: AssetType) => {
    if (!id) {
      return;
    }
    const url = {
      chart: `${import.meta.env.VITE_API}/chart/duplicate/${id}`,
      dataset: `${import.meta.env.VITE_API}/dataset/duplicate/${id}`,
      story: `${import.meta.env.VITE_API}/story/duplicate/${id}`,
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

  React.useEffect(() => {
    if (!assetsLoadSuccess) {
      return;
    }
    updateLog({
      level: "info",
      message: "Updating loaded assets in assets grid",
    });
    //update the loaded stories
    setLoadedAssets((prevAssets) => {
      const prevAssetsIds = prevAssets.map((c) => c.id);
      const f = assets.filter((asset) => !prevAssetsIds.includes(asset.id));
      return [...prevAssets, ...f];
    });
  }, [assetsLoadSuccess]);

  React.useEffect(() => {
    reloadData();
  }, [props.sortBy, token, props.filterValue, props.selectActive]);

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
          cellWidths={[50, 300, 350, 142, 142, 142, 138, 150]}
          tableData={{
            columns: getColumns(),
            data: loadedAssets.map((data) =>
              renderAssetTableData(data, data.assetType)
            ),
          }}
        />
      ) : (
        <div id={props.gridId}>
          <Grid container spacing={2}>
            {loadedAssets.map((d) => (
              <Grid
                item
                key={d.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                onClick={(e) => {
                  if (props.selectActive) {
                    e.stopPropagation();
                    if (props.selectedItems.some((item) => item.id === d.id)) {
                      props.setSelectedItems(
                        props.selectedItems.filter((item) => item.id !== d.id)
                      );
                    } else {
                      props.setSelectedItems([
                        ...props.selectedItems,
                        { id: d.id, assetType: d.assetType },
                      ]);
                    }
                  }
                }}
              >
                {
                  <RenderAsset
                    data={d}
                    handleModal={handleModal}
                    handleDuplicate={handleDuplicate}
                    setActiveAssetType={setActiveAssetType}
                    inChartBuilder={props.inChartBuilder}
                    activeAssetType={d.assetType as AssetType}
                    selectedItems={props.selectedItems}
                    setSelectedItems={props.setSelectedItems}
                    selectActive={props.selectActive}
                    allChartsSelected={props.allChartsSelected}
                    allDatasetsSelected={props.allDatasetsSelected}
                    allStoriesSelected={props.allStoriesSelected}
                  />
                }

                <Box height={16} />
              </Grid>
            ))}
          </Grid>
        </div>
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
        }[activeAssetType as AssetType]
      }
    </>
  );
}
