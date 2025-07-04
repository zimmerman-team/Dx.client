import React from "react";

/* third-party */
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
/* project */
import ChartsGrid from "app/modules/home-module/components/AssetCollection/Charts/chartsGrid";
import StoriesGrid from "app/modules/home-module/components/AssetCollection/Stories/storiesGrid";
import DatasetsGrid from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import {
  homeDisplayAtom,
  allAssetsViewAtom,
  allAssetsSortBy,
  allAssetsFilterBy,
} from "app/state/recoil/atoms";
import { featuredAssetsCss } from "app/modules/home-module/style";
import DatasetCategoryList from "app/modules/home-module/components/AssetCollection/Datasets/datasetCategoryList";
import { datasetCategories } from "app/modules/dataset-module/routes/upload-module/upload-steps/step3/metaData";
import AssetsGrid from "app/modules/home-module/components/AssetCollection/All/assetsGrid";
import Filter from "app/modules/home-module/components/Filter";
import {
  DESKTOP_BREAKPOINT,
  DESKTOP_STARTPOINT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "app/theme";
import { MultiSwitch } from "app/modules/home-module/components/TabSwitch";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import get from "lodash/get";

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
      "Once you have dataset(s) connected, you can use them to build charts and visualisations, all assited and eased by DataXplorer.",
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

const getWhereString = (searchStr: string, userOnly: boolean) => {
  const value =
    searchStr?.length > 0
      ? `where={"name":{"like":"${searchStr}.*","options":"i"}}`
      : "";
  return `${userOnly ? "userOnly=true&" : ""}${value}`;
};
function AssetsCollection() {
  const history = useHistory();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [assetsView, setAssetsView] = useRecoilState(allAssetsViewAtom);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = useRecoilState(allAssetsSortBy);
  const [filterValue, setFilterValue] = useRecoilState(allAssetsFilterBy);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const token = useStoreState((state) => state.AuthToken.value);

  const userOnlyFilter = filterValue === "myAssets";

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

  React.useEffect(() => {
    if (token) {
      loadAssetsCount({
        token,
        filterString: getWhereString(searchValue as string, userOnlyFilter),
      });

      loadDatasetCount({
        token,
        filterString: getWhereString(searchValue as string, userOnlyFilter),
      });
      loadChartsCount({
        token,
        filterString: getWhereString(searchValue as string, userOnlyFilter),
      });
      loadStoriesCount({
        token,
        filterString: getWhereString(searchValue as string, userOnlyFilter),
      });
    }
  }, [loadChartsCount, loadDatasetCount, loadStoriesCount, token]);

  const displayGrid = (searchStr: string, sortByStr: string) => {
    switch (display) {
      case "data":
        return (
          <DatasetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            categories={categories}
            userOnly={filterValue === "myAssets"}
          />
        );
      case "charts":
        return (
          <ChartsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            userOnly={filterValue === "myAssets"}
          />
        );
      case "stories":
        return (
          <StoriesGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            userOnly={filterValue === "myAssets"}
          />
        );
      case "all":
        return (
          <AssetsGrid
            sortBy={sortByStr}
            searchStr={searchStr}
            view={assetsView}
            userOnly={filterValue === "myAssets"}
          />
        );
      default:
        break;
    }
  };

  const handleTabSwitch = (tab: string) => {
    setDisplay(tab as "all" | "data" | "charts" | "stories");
  };

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
          `}
        >
          {ctaCards.map((card) => (
            <div
              onClick={() => {
                history.push(card.link);
              }}
              key={card.type}
              css={`
                border-radius: 10px;
                padding: 16px;
                background: #f1f3f5;
                box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.05);
                width: 296px;
                height: 161px;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                h1 {
                  color: #6061e5;
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 18px;
                  line-height: 24px;
                  margin: 0;
                  margin-bottom: 13px;
                }
                > p:first-of-type {
                  color: #231d2c;
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  font-size: 12px;
                  font-weight: 325;
                  line-height: normal;
                  margin: 0;
                }
              `}
            >
              <h1>{card.title}</h1>
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
                  >
                    <path
                      d="M8.75 0.25L7.85625 1.12063L12.5938 5.875H0V7.125H12.5938L7.85625 11.8581L8.75 12.75L15 6.5L8.75 0.25Z"
                      fill="#6061E5"
                    />
                  </svg>
                </div>
              </div>
            </div>
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
            @media (max-width: 599px) {
              flex-flow: wrap-reverse;
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
              tabs={[
                {
                  value: "all",
                  label: `All (${assetsCount})`,
                  testId: "home-all-tab",
                },
                {
                  value: "data",
                  label: `Data (${datasetCount})`,
                  testId: "home-data-tab",
                },
                {
                  value: "charts",
                  label: `Charts (${chartsCount})`,
                  testId: "home-charts-tab",
                },
                {
                  value: "stories",
                  label: `Stories (${storiesCount})`,
                  testId: "home-stories-tab",
                },
              ]}
            />
          </div>

          <div
            css={`
              display: none;
              flex-basis: 56%;
              @media (min-width: ${DESKTOP_STARTPOINT}) {
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
              hasSearch
            />
          </div>
        </div>

        <div
          css={`
            display: none;
            @media (min-width: ${TABLET_STARTPOINT}) {
              @media (max-width: ${DESKTOP_BREAKPOINT}) {
                padding-top: 16px;
                display: block;
              }
            }
            @media (max-width: ${MOBILE_BREAKPOINT}) {
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
            hasSearch
          />
        </div>
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
          @media (max-width: 960px) {
            padding: 0 32px;
          }
        `}
      >
        {displayGrid(searchValue as string, sortValue)}
      </div>
    </Container>
  );
}

export default AssetsCollection;
