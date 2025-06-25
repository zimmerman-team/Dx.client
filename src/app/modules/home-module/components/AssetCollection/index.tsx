import React from "react";

/* third-party */
import { Link, useHistory } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
/* project */
import { Tab } from "app/components/Styled/tabs";
import ChartsGrid from "app/modules/home-module/components/AssetCollection/Charts/chartsGrid";
import StoriesGrid from "app/modules/home-module/components/AssetCollection/Stories/storiesGrid";
import DatasetsGrid from "app/modules/home-module/components/AssetCollection/Datasets/datasetsGrid";
import {
  homeDisplayAtom,
  allAssetsViewAtom,
  allAssetsSortBy,
  allAssetsFilterBy,
} from "app/state/recoil/atoms";
import {
  featuredAssetsCss,
  rowFlexCss,
  turnsDataCss,
} from "app/modules/home-module/style";
import DatasetCategoryList from "app/modules/home-module/components/AssetCollection/Datasets/datasetCategoryList";
import { datasetCategories } from "app/modules/dataset-module/routes/upload-module/upload-steps/metaData";
import AssetsGrid from "app/modules/home-module/components/AssetCollection/All/assetsGrid";
import BreadCrumbs from "app/modules/home-module/components/Breadcrumbs";
import Filter from "app/modules/home-module/components/Filter";
import AddAssetDropdown from "app/modules/home-module/components/AddAssetDropdown";
import {
  DESKTOP_BREAKPOINT,
  DESKTOP_STARTPOINT,
  MOBILE_BREAKPOINT,
  TABLET_STARTPOINT,
} from "app/theme";
import useMediaQuery from "@material-ui/core/useMediaQuery";

function AssetsCollection() {
  const { isAuthenticated, user } = useAuth0();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [assetsView, setAssetsView] = useRecoilState(allAssetsViewAtom);
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const [sortValue, setSortValue] = useRecoilState(allAssetsSortBy);
  const [filterValue, setFilterValue] = useRecoilState(allAssetsFilterBy);
  const [display, setDisplay] = useRecoilState(homeDisplayAtom);
  const [tabPrevPosition, setTabPrevPosition] = React.useState("");

  const laptop = useMediaQuery("(min-width: 960px)");

  const handleChange = (newValue: "all" | "data" | "charts" | "stories") => {
    setDisplay(newValue);
  };

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

  React.useEffect(() => {
    if (display === "all" || display === "data") {
      setTabPrevPosition("left");
    } else {
      setTabPrevPosition("right");
    }
  }, [display]);

  const descriptions = {
    all: "Explore The Collection of Assets",
    data: "Explore The Collection of Datasets ",
    charts: "Explore The Collection of Charts ",
    stories: "Explore The Collection of Stories",
  };

  const shareData = {
    title: "MDN",
    text: "Best Seller Book chart",
    url: "http://localhost:3000/chart/6796530b8f00e1006902376d",
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
      <div css={turnsDataCss}>
        {isAuthenticated ? (
          <Grid container alignItems="center">
            <Grid item lg={5} md={5} sm={7} xs={11}>
              <h4
                css={`
                  font-size: 18px;
                `}
              >
                Library
              </h4>
              <h2>Welcome {user?.given_name ?? user?.name?.split(" ")[0]}</h2>
            </Grid>
            <Grid
              item
              lg={7}
              md={7}
              sm={5}
              xs={1}
              css={`
                display: block;

                @media (max-width: 965px) {
                  margin-top: 16px;
                  @media (max-width: ${MOBILE_BREAKPOINT}) {
                    display: none;
                  }
                }
              `}
            >
              <div
                css={`
                  display: flex;
                  justify-self: flex-end;
                `}
              >
                <AddAssetDropdown />
              </div>
            </Grid>
          </Grid>
        ) : (
          <div />
        )}
      </div>
      <Box height={32} />
      <Box css={featuredAssetsCss}>
        <Grid
          container
          alignContent="space-between"
          alignItems="center"
          css={`
            width: 100%;
            @media (max-width: 599px) {
              flex-flow: wrap-reverse;
            }
          `}
        >
          <Grid item lg={6} md={6} sm={6} xs={12}>
            <Tab.Container>
              <Tab.Left
                active={display === "all"}
                onClick={() => handleChange("all")}
                data-cy="home-all-tab"
              >
                All
              </Tab.Left>
              <Tab.Center
                active={display === "data"}
                onClick={() => handleChange("data")}
                position={tabPrevPosition}
                data-cy="home-data-tab"
              >
                Data
              </Tab.Center>
              <Tab.Center
                active={display === "charts"}
                onClick={() => handleChange("charts")}
                position={tabPrevPosition}
                data-cy="home-charts-tab"
              >
                Chart
              </Tab.Center>

              <Tab.Right
                active={display === "stories"}
                onClick={() => handleChange("stories")}
                data-cy="home-stories-tab"
              >
                Story
              </Tab.Right>
            </Tab.Container>
          </Grid>

          <Grid item lg={6} md={6} sm={6} xs={12}>
            <div
              css={`
                display: none;

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
          </Grid>
        </Grid>
        <div
          css={`
            padding-top: 16px;
            font-size: 14px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            color: #231d2c;
            line-height: normal;
          `}
        >
          {descriptions[display]}
        </div>{" "}
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
          {laptop ? null : (
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
          )}
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
