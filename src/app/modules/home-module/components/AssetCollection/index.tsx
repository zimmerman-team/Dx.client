import React from "react";

/* third-party */
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
/* project */
import ChartsGrid from "@app/modules/home-module/components/AssetCollection/Charts/chartsGrid";
import StoriesGrid from "@app/modules/home-module/components/AssetCollection/Stories/storiesGrid";
import DatasetsGrid from "@app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import {
  homeDisplayAtom,
  allAssetsViewAtom,
  allAssetsSortBy,
  allAssetsFilterBy,
} from "@app/state/recoil/atoms";
import { featuredAssetsCss } from "@app/modules/home-module/style";
import DatasetCategoryList from "@app/modules/home-module/components/AssetCollection/Datasets/datasetCategoryList";
import { datasetCategories } from "@app/modules/dataset-module/routes/upload-module/upload-steps/step3/metaData";
import AssetsGrid from "@app/modules/home-module/components/AssetCollection/All/assetsGrid";
import Filter from "@app/modules/home-module/components/Filter";
import {
  DESKTOP_BREAKPOINT,
  FOCUS_VISIBLE_STYLE_LIGHT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "@app/theme";
import { MultiSwitch } from "@app/modules/home-module/components/TabSwitch";
import { useStoreActions, useStoreState } from "@app/state/store/hooks";
import get from "lodash/get";
import MobileControls from "@app/modules/home-module/components/MobileAssetsControls";
import { Select, useMediaQuery } from "@material-ui/core";
import { useDebounce } from "react-use";
import { SelectAssetsSnackBar } from "@app/modules/home-module/components/SelectAssetsSnackBar";
import DeleteAssetsDialog from "@app/components/Dialogs/deleteAssetsDialog";
import useDeleteAssets from "@app/hooks/useDeleteAssets";
import { PageLoader } from "@app/modules/common/page-loader";

const ctaCards = [
  {
    title: "Connect Dataset",
    description:
      "Connecting a dataset is the first step in building charts and creating stories. Upload your own or discover new datasets via the federated search — all within the platform.",
    type: "dataset",
    link: "/dataset/new/upload",
    cypressId: "create-dataset-cta",
    linkText: "Add Dataset",
  },
  {
    title: "Create Charts",
    description:
      "Once you have dataset(s) connected, you can use them to build charts and visualisations, all assisted and eased by Dataxplorer.",
    type: "chart",
    link: "/chart/new/data",
    cypressId: "create-chart-cta",
    linkText: "Create a Chart",
  },
  {
    title: "Create Stories",
    description:
      "Use this builder to craft your story by inserting charts and customizing the canvas with text and visuals—just like a report builder.",
    type: "story",
    link: "/story/new/initial",
    cypressId: "create-story-cta",
    linkText: "Build a Story",
  },
];

const getWhereString = (searchStr: string, filterValue: string) => {
  const value =
    searchStr?.length > 0
      ? `where={"name":{"like":"${searchStr}.*","options":"i"}}`
      : "";
  return `filterValue=${filterValue}&${value}`;
};
function AssetsCollection() {
  const history = useHistory();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [assetsView, setAssetsView] = useRecoilState(allAssetsViewAtom);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = useRecoilState(allAssetsSortBy);
  const [filterValue, setFilterValue] = useRecoilState(allAssetsFilterBy);
  const [deleteActive, setDeleteActive] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<
    { assetType: string; id: string }[]
  >([]);
  const [allChartsSelected, setAllChartsSelected] =
    React.useState<boolean>(false);
  const [allDatasetsSelected, setAllDatasetsSelected] =
    React.useState<boolean>(false);
  const [allStoriesSelected, setAllStoriesSelected] =
    React.useState<boolean>(false);

  const [deleteAssetsDialog, setDeleteAssetsDialog] = React.useState(false);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const token = useStoreState((state) => state.AuthToken.value);
  const gridId = "assets-grid";

  const tablet = useMediaQuery(`(max-width: ${DESKTOP_BREAKPOINT})`);
  const mobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`);
  const loadChartsCount = useStoreActions(
    (actions) => actions.charts.ChartsCount.fetch
  );
  const loadDatasetCount = useStoreActions(
    (actions) => actions.dataThemes.DatasetCount.fetch
  );
  const loadStoriesCount = useStoreActions(
    (actions) => actions.stories.StoriesCount.fetch
  );
  const loadAssetsCount = useStoreActions(
    (actions) => actions.assets.AssetsCount.fetch
  );
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const loadCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );
  const loadStories = useStoreActions(
    (actions) => actions.stories.StoryGetList.fetch
  );
  const datasetCount = useStoreState(
    (state) => get(state, "dataThemes.DatasetCount.data.count", 0) as number
  );
  const chartsCount = useStoreState(
    (state) => get(state, "charts.ChartsCount.data.count", 0) as number
  );
  const storiesCount = useStoreState(
    (state) => get(state, "stories.StoriesCount.data.count", 0) as number
  );
  const assetsCount = useStoreState(
    (state) => get(state, "assets.AssetsCount.data.count", 0) as number
  );

  const { mutate: deleteAssets, loading: deleteAssetsLoading } =
    useDeleteAssets();

  // React.useEffect(() => {
  //   if (token) {
  //     loadAssetsCount({
  //       token,
  //       filterString: getWhereString(searchValue as string, filterValue),
  //     });

  //     loadDatasetCount({
  //       token,
  //       filterString: getWhereString(searchValue as string, filterValue),
  //     });
  //     loadChartsCount({
  //       token,
  //       filterString: getWhereString(searchValue as string, filterValue),
  //     });
  //     loadStoriesCount({
  //       token,
  //       filterString: getWhereString(searchValue as string, filterValue),
  //     });
  //   }
  // }, [token, filterValue, searchValue]);

  React.useEffect(() => {
    setSelectedItems([]);
  }, [deleteActive]);

  useDebounce(
    () => {
      if (token) {
        loadAssetsCount({
          token,
          filterString: getWhereString(searchValue as string, filterValue),
        });

        loadDatasetCount({
          token,
          filterString: getWhereString(searchValue as string, filterValue),
        });
        loadChartsCount({
          token,
          filterString: getWhereString(searchValue as string, filterValue),
        });
        loadStoriesCount({
          token,
          filterString: getWhereString(searchValue as string, filterValue),
        });
      }
    },
    500,
    [searchValue, filterValue, token]
  );
  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            categories={categories}
            filterValue={filterValue}
            gridId={gridId}
            selectActive={deleteActive}
            allSelected={allDatasetsSelected}
            setAllSelected={setAllDatasetsSelected}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            filterValue={filterValue}
            gridId={gridId}
            selectActive={deleteActive}
            allSelected={allChartsSelected}
            setAllSelected={setAllChartsSelected}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        );
      case "stories":
        return (
          <StoriesGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            filterValue={filterValue}
            gridId={gridId}
            selectActive={deleteActive}
            allSelected={allStoriesSelected}
            setAllSelected={setAllStoriesSelected}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        );
      case "all":
        return (
          <AssetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            filterValue={filterValue}
            gridId={gridId}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
            allStoriesSelected={allStoriesSelected}
            allDatasetsSelected={allDatasetsSelected}
            allChartsSelected={allChartsSelected}
            setAllChartsSelected={setAllChartsSelected}
            setAllDatasetsSelected={setAllDatasetsSelected}
            setAllStoriesSelected={setAllStoriesSelected}
            selectActive={deleteActive}
          />
        );
      default:
        break;
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && deleteActive) {
        setDeleteActive(false);
        setSelectedItems([]);
        setAllChartsSelected(false);
        setAllDatasetsSelected(false);
        setAllStoriesSelected(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteActive]);

  const handleTabSwitch = (tab: string) => {
    setDisplay(tab as "all" | "data" | "charts" | "stories");
  };
  console.log(assetsCount, chartsCount, datasetCount, storiesCount);

  const selectedCount = React.useMemo(() => {
    let count = selectedItems.length;
    if (allChartsSelected && allStoriesSelected && allDatasetsSelected) {
      count = assetsCount;
      return count;
    }
    if (allChartsSelected) {
      count -= selectedItems.filter(
        (item) => item.assetType === "chart"
      ).length;
      count += chartsCount;
    }
    if (allStoriesSelected) {
      count -= selectedItems.filter(
        (item) => item.assetType === "story"
      ).length;
      count += storiesCount;
    }
    if (allDatasetsSelected) {
      count -= selectedItems.filter(
        (item) => item.assetType === "dataset"
      ).length;
      count += datasetCount;
    }
    return count;
  }, [
    assetsCount,
    chartsCount,
    datasetCount,
    storiesCount,
    display,
    allChartsSelected,
    allStoriesSelected,
    allDatasetsSelected,
    selectedItems,
  ]);

  return (
    <Container
      maxWidth="lg"
      css={`
        @media (max-width: 960px) {
          padding: 0 32px;
        }
      `}
    >
      <div
        css={`
          h1 {
            color: #231d2c;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 40px;
            line-height: 110%;
          }
        `}
      >
        <h1>Your Dashboard</h1>
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 18px;
            @media (max-width: ${MOBILE_BREAKPOINT}) {
              flex-direction: column;
              gap: 10px;
              padding: 0 16px;
            }
          `}
        >
          {ctaCards.map((card) => (
            <button
              onClick={() => {
                history.push(card.link);
              }}
              aria-label={`Call to Action to ${card.title}`}
              key={card.type}
              css={`
                background: none;
                border: none;
                padding: 0;
                margin: 0;
                font: inherit;
                color: inherit;
                text-align: inherit;
                appearance: none; /* removes native OS/browser styles */
                -webkit-appearance: none;
                user-select: text;
                border-radius: 10px;
                padding: 16px;
                background: #f1f3f5;
                box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
                width: 296px;
                height: 161px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                :focus-visible {
                  ${FOCUS_VISIBLE_STYLE_LIGHT}
                }
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  width: 100%;
                }
                p:first-of-type {
                  color: #6061e5;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 18px;
                  line-height: 24px;
                  margin: 0;
                }
                > p:nth-of-type(2) {
                  color: #231d2c;
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  font-size: 12px;
                  font-weight: 325;
                  line-height: normal;
                  margin: 0;
                  height: 70px;
                }
              `}
            >
              <p>{card.title}</p>
              <p>{card.description}</p>
              <div
                css={`
                  display: flex;
                  flex: 1;
                  align-items: flex-end;
                  width: 100%;
                  p {
                    color: #6061e5;
                    font-family: "GothamNarrow-Bold", "Helvetica Neue",
                      sans-serif;
                    font-size: 14px;
                    line-height: 20px;
                    margin: 0;
                  }
                `}
              >
                <div
                  css={`
                    display: flex;
                    align-items: center;
                    gap: 11px;
                    justify-content: flex-end;
                    width: 100%;
                  `}
                >
                  <p> {card.linkText} </p>
                  <svg
                    width="15"
                    height="13"
                    viewBox="0 0 15 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="presentation"
                  >
                    <path
                      d="M8.75 0.25L7.85625 1.12063L12.5938 5.875H0V7.125H12.5938L7.85625 11.8581L8.75 12.75L15 6.5L8.75 0.25Z"
                      fill="#6061E5"
                    />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <Box height={32} />

      <Box css={featuredAssetsCss}>
        <div
          css={`
            width: 100%;
            display: flex;
            gap: 10px;
            align-items: center;
            @media (max-width: ${MOBILE_BREAKPOINT}) {
              display: none;
            }
          `}
        >
          <div
            css={`
              width: 531px;
              height: 41px;
            `}
          >
            <MultiSwitch
              activeTab={display}
              onTabChange={handleTabSwitch}
              style={{
                radius: 10,
                paddingX: 4,
                backgroundActive: "#6061E5",
              }}
              ariaControls={display + "-assets"}
              tabs={[
                {
                  value: "all",
                  label: `All (${assetsCount})`,
                  testId: "home-all-tab",
                  id: "tab-all",
                },
                {
                  value: "data",
                  label: `Data (${datasetCount})`,
                  testId: "home-data-tab",
                  id: "tab-data",
                },
                {
                  value: "charts",
                  label: `Charts (${chartsCount})`,
                  testId: "home-charts-tab",
                  id: "tab-charts",
                },
                {
                  value: "stories",
                  label: `Stories (${storiesCount})`,
                  testId: "home-stories-tab",
                  id: "tab-stories",
                },
              ]}
            />
          </div>

          <div
            css={`
              display: block;
              flex-basis: 56%;
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                display: none;
              }
            `}
          >
            <Filter
              searchValue={searchValue as string}
              setSearchValue={setSearchValue}
              setSortValue={setSortValue}
              setAssetsView={setAssetsView}
              sortValue={sortValue}
              assetsView={assetsView}
              openSearch={openSearch}
              setOpenSearch={setOpenSearch}
              searchIconCypressId="home-search-button"
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              deleteActive={deleteActive}
              setDeleteActive={setDeleteActive}
              hasSearchButton
              terminateSearch={() => {}}
            />
          </div>
        </div>

        {mobile ? (
          <div
            css={`
              display: none;

              @media (max-width: ${MOBILE_BREAKPOINT}) {
                display: block;
              }
            `}
          >
            <MobileControls
              assetsControlsProps={{
                datasetCount,
                chartCount: chartsCount,
                storyCount: storiesCount,
                allCount: assetsCount,
              }}
              searchInputProps={{
                searchValue: searchValue as string,
                onSearchChange: (e) => setSearchValue(e.target.value),
                onFocus: () => setOpenSearch(true),
                openSearch,
                setOpenSearch,
                hasSearchButton: true,
                searchIconCypressId: "home-search-button",
                onKeyPress: (e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                  }
                },
              }}
              terminateSearch={() => setOpenSearch(false)}
              setSortValue={setSortValue}
              setFilterValue={setFilterValue}
              setAssetsView={setAssetsView}
              assetsView={assetsView}
              sortValue={sortValue}
              filterValue={filterValue}
            />
          </div>
        ) : tablet ? (
          <div
            css={`
              display: none;

              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                padding-top: 16px;
                display: block;
              }
            `}
          >
            <Filter
              searchValue={searchValue as string}
              setSearchValue={setSearchValue}
              setSortValue={setSortValue}
              setAssetsView={setAssetsView}
              sortValue={sortValue}
              assetsView={assetsView}
              openSearch={openSearch}
              setOpenSearch={setOpenSearch}
              searchIconCypressId="home-search-button"
              filterValue={filterValue}
              setFilterValue={setFilterValue}
              deleteActive={deleteActive}
              setDeleteActive={setDeleteActive}
              hasSearchButton
              terminateSearch={() => {}}
            />
          </div>
        ) : null}

        {display === "data" ? (
          <DatasetCategoryList
            datasetCategories={datasetCategories}
            setCategories={setCategories}
            categories={categories}
          />
        ) : (
          <Box height={32} />
        )}
      </Box>

      <div
        id="scrollableDiv"
        css={`
          ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
          }
          @media (max-width: ${DESKTOP_BREAKPOINT}) {
            padding: 0 35px;
          }
          @media (max-width: ${MOBILE_BREAKPOINT}) {
            padding: 0 16px;
          }
        `}
      >
        {displayGrid(searchValue as string, sortValue)}
      </div>
      <SelectAssetsSnackBar
        count={selectedCount}
        open={deleteActive}
        onClose={() => {
          setDeleteActive(false);
          setSelectedItems([]);
          setAllChartsSelected(false);
          setAllDatasetsSelected(false);
          setAllStoriesSelected(false);
        }}
        onSelectAll={() => {
          if (display === "charts") {
            setAllChartsSelected(true);
          } else if (display === "data") {
            setAllDatasetsSelected(true);
          } else if (display === "stories") {
            setAllStoriesSelected(true);
          } else {
            setAllChartsSelected(true);
            setAllDatasetsSelected(true);
            setAllStoriesSelected(true);
          }
        }}
        onDelete={() => {
          setDeleteAssetsDialog(true);
        }}
      />
      <DeleteAssetsDialog
        modalDisplay={deleteAssetsDialog}
        setModalDisplay={setDeleteAssetsDialog}
        handleDelete={async () => {
          await deleteAssets({
            assets: selectedItems,
            deleteAllCharts: allChartsSelected,
            deleteAllStories: allStoriesSelected,
            deleteAllDatasets: allDatasetsSelected,
          });
          setDeleteActive(false);
          setSelectedItems([]);
          setAllChartsSelected(false);
          setAllDatasetsSelected(false);
          setAllStoriesSelected(false);
          setDeleteAssetsDialog(false);
        }}
        chartsCount={
          allChartsSelected
            ? chartsCount
            : selectedItems.filter((item) => item.assetType === "chart").length
        }
        storiesCount={
          allStoriesSelected
            ? storiesCount
            : selectedItems.filter((item) => item.assetType === "story").length
        }
        datasetCount={
          allDatasetsSelected
            ? datasetCount
            : selectedItems.filter((item) => item.assetType === "dataset")
                .length
        }
      />
      {deleteAssetsLoading && <PageLoader />}
    </Container>
  );
}

export default AssetsCollection;
