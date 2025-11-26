import React, { useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import Filter from "app/modules/home-module/components/Filter";
import ExternalDatasetCard from "app/modules/home-module/components/AssetCollection/Datasets/externalDatasetCard";
import { useStoreState } from "app/state/store/hooks";
import useDebounce from "react-use/lib/useDebounce";
import axios from "axios";
import CircleLoader from "app/modules/home-module/components/Loader";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import { useRecoilState, useSetRecoilState } from "recoil";
import { externalDataSortByAtom, planDialogAtom } from "app/state/recoil/atoms";
import ExternalSearchTable from "app/modules/dataset-module/routes/upload-module/component/table/externalSearchTable";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import TableSkeleton from "app/modules/dataset-module/routes/upload-module/upload-steps/step2/tableSkeleton";

export interface IExternalDataset {
  name: string;
  description: string;
  url: string;
  source: string;
  datePublished: string;
}

const ExternalSearch = (props: {
  handleDownload: (dataset: IExternalDataset) => void;
}) => {
  const observerTarget = React.useRef(null);
  const scrollPointRef = React.useRef<HTMLDivElement>(null);
  const [view, setView] = React.useState<"grid" | "table">("table");
  const [searchValue, setSearchValue] = React.useState<string | undefined>("");
  const [sources, setSources] = React.useState<string[]>([]);
  // const [sortValue, setSortValue] = React.useState("name");
  const [sortValue, setSortValue] = useRecoilState(externalDataSortByAtom);
  const token = useStoreState((state) => state.AuthToken.value);
  const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const limit = 20;
  const [datasets, setDatasets] = React.useState<IExternalDataset[]>([]);
  const [planWarning, setPlanWarning] = React.useState<string | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const baseSources = [
    { name: "Kaggle", value: "Kaggle" },
    { name: "World Bank", value: "World Bank" },
    { name: "WHO", value: "WHO" },
    { name: "HDX", value: "HDX" },
    { name: "The Global Fund", value: "TGF" },
  ];

  const { isObserved } = useInfinityScroll(observerTarget);

  const abortControllerRef = React.useRef<AbortController>(
    new AbortController()
  );
  const terminateSearch = () => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  };

  const { userPlan } = useCheckUserPlan();

  const free = userPlan?.planData.name === "Free";
  // Pagination on scroll
  React.useEffect(() => {
    if (isObserved && datasets.length > 0 && !free) {
      loadSearch(true);
    }
  }, [isObserved]);

  const loadSearch = async (nextPage: boolean = false) => {
    const localOffset = nextPage ? offset : 0;
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          process.env.REACT_APP_API
        }/external-sources/search?q=${searchValue}&source=${
          sources.length ? sources.join(",") : "Kaggle,World Bank,WHO,HDX,TGF"
        }&offset=${localOffset}&limit=${limit}&sortBy=${sortValue}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsSearching(false);
      setLoading(false);
      if (response.data.error) {
        console.log(response.data.error);
        return;
      }
      if (response.data.planWarning) {
        setPlanWarning(response.data.planWarning);
      }
      if (nextPage) {
        setDatasets([...datasets, ...response.data.result]);
        setOffset(offset + limit);
      } else {
        setDatasets(response.data.result);
        setOffset(limit);
      }
    } catch (e) {
      setIsSearching(false);
      setLoading(false);
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (planWarning) {
      setPlanDialog({
        open: true,
        message: planWarning,
        tryAgain: "",
        onTryAgain: () => {},
      });
    }
  }, [planWarning]);

  React.useEffect(() => {
    const controller = abortControllerRef.current;
    return () => {
      controller.abort();
    };
  }, []);

  const firstTimeRef = React.useRef(true);

  useEffect(() => {
    if (token && firstTimeRef.current) {
      loadSearch();
    }
  }, [token]);
  const t =
    "http://localhost:4200/stories?filter={%22order%22:%22updatedDate%20desc%22,%22limit%22:15,%22offset%22:0}";
  const v =
    "http://localhost:4200/stories?filter={%22order%22:%22updatedDate%20desc%22,%22limit%22:15,%22offset%22:0}";

  const [,] = useDebounce(
    () => {
      if (token) {
        if (firstTimeRef.current) {
          firstTimeRef.current = false;
          return;
        }
        onSearch();
      }
    },
    500,
    [token, sources, searchValue, sortValue]
  );

  const onSearch = () => {
    setView("table");
    if (token) {
      setIsSearching(true);
      loadSearch();
    }
  };
  const handleFocus = () => {
    scrollPointRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start", // This puts the input at the very top
    });
  };

  const viewToDisplay = () => {
    switch (view) {
      case "grid":
        return (
          <Grid container spacing={2}>
            {datasets &&
              datasets?.map((dataset, index) => (
                <Grid
                  item
                  lg={3}
                  md={4}
                  sm={6}
                  xs={12}
                  key={`${dataset.name}-${index}`}
                >
                  <ExternalDatasetCard
                    description={dataset.description}
                    name={dataset.name}
                    publishedDate={dataset.datePublished}
                    source={dataset.source}
                    url={dataset.url}
                    handleDownload={() => props.handleDownload(dataset)}
                    dataset={dataset}
                    searchValue={searchValue}
                  />
                  <Box height={16} />
                </Grid>
              ))}
          </Grid>
        );
      case "table":
        return (
          <ExternalSearchTable
            onItemClick={props.handleDownload}
            tableData={{
              columns: [
                { key: "name", label: "Dataset Title" },
                { key: "source", label: "Source" },
                { key: "description", label: "Description" },
                { key: "datePublished", label: "Date" },
              ],
              data: datasets,
            }}
          />
        );
      default:
        return null;
    }
  };

  const renderExtDatasets = () => {
    if (isSearching) {
      return <TableSkeleton rowLength={20} />;
    } else if (datasets.length === 0 && !loading) {
      return (
        <div
          css={`
            text-align: center;
            height: 221px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            font-style: normal;
            font-weight: 325;
            line-height: normal;
            letter-spacing: 0.5px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          `}
        >
          No datasets were found using external search. Please consider trying a
          different search description.
        </div>
      );
    } else {
      return viewToDisplay();
    }
  };

  return (
    <>
      <div
        ref={scrollPointRef}
        css={`
          color: #231d2c;

          > h2 {
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 24px;
            margin: 0;
          }
          > p {
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            margin: 0;
            font-size: 14px;
          }
        `}
      >
        <h2>Search External Data Sources</h2>
        <p>
          External search allows you to search and import data from WHO, World
          Bank, The Global Fund, Kaggle and the Humanitarian Data exchange.{" "}
        </p>
      </div>
      <div
        css={`
          height: 30px;
        `}
      />
      <div
        css={`
          height: 16px;
        `}
      />
      <Grid container alignItems="center">
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Filter
            searchValue={searchValue as string}
            setSearchValue={setSearchValue}
            setSortValue={setSortValue}
            setAssetsView={setView}
            sortValue={sortValue}
            assetsView={view}
            searchInputWidth="249px"
            searchIconCypressId="open-search-button"
            hasSearchButton={false}
            onFocus={handleFocus}
            openSearch={true}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            terminateSearch={terminateSearch}
            setFilterValue={() => {}}
            filterValue={null as unknown as string}
          />
        </Grid>
      </Grid>

      <Box height={25} />

      {renderExtDatasets()}

      <div
        ref={observerTarget}
        css={`
          height: 1px;
        `}
      />

      <Box display={"flex"} justifyContent={"center"}>
        {loading && <CircleLoader />}
      </Box>
    </>
  );
};

export default ExternalSearch;
