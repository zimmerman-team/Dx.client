import React, { useEffect } from "react";
import { Box, Grid } from "@material-ui/core";
import Filter from "app/modules/home-module/components/Filter";
import ExternalDatasetCard from "app/modules/home-module/components/AssetCollection/Datasets/externalDatasetCard";
import { useStoreState } from "app/state/store/hooks";
import useDebounce from "react-use/lib/useDebounce";
import axios from "axios";
import CircleLoader from "app/modules/home-module/components/Loader";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";
import SourceCategoryList from "app/modules/dataset-module/routes/upload-module/component/externalSourcesList";
import { useRecoilState, useSetRecoilState } from "recoil";
import { externalDataSortByAtom, planDialogAtom } from "app/state/recoil/atoms";
import SaveAltIcon from "@material-ui/icons/SaveAlt";
import ExternalSearchTable from "app/modules/dataset-module/routes/upload-module/component/table/externalSearchTable";
import { useCheckUserPlan } from "app/hooks/useCheckUserPlan";
import { PrimaryButton } from "app/components/Styled/button";
import { SearchIcon } from "app/assets/icons/Search";
import { ChevronRight } from "@material-ui/icons";

export interface IExternalDataset {
  name: string;
  description: string;
  url: string;
  source: string;
  datePublished: string;
}

export default function ExternalSearch(props: {
  setFormDetails: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      category: string;
      public: boolean;
      source: string;
      sourceUrl: string;
    }>
  >;
  handleDownload: (dataset: IExternalDataset) => void;
  setProcessingError: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  searchValue: string | undefined;
  setSearchValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  sources: string[];
  setSources: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const observerTarget = React.useRef(null);
  const [view, setView] = React.useState<"grid" | "table">("grid");

  // const [sortValue, setSortValue] = React.useState("name");
  const [sortValue, setSortValue] = useRecoilState(externalDataSortByAtom);
  const token = useStoreState((state) => state.AuthToken.value);
  const [loading, setLoading] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const limit = 20;
  const [datasets, setDatasets] = React.useState<IExternalDataset[]>([]);
  const [planWarning, setPlanWarning] = React.useState<string | null>(null);
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
    setOffset(0);
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
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/external-sources/search?q=${
          props.searchValue
        }&source=${
          props.sources.length
            ? props.sources.join(",")
            : "Kaggle,World Bank,WHO,HDX,TGF"
        }&offset=${offset}&limit=${limit}&sortBy=${sortValue}`,
        {
          signal: abortControllerRef.current.signal,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      setDatasets([]);
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
        setDatasets([]);
        loadSearch();
      }
    },
    500,
    [token, props.sources, sortValue]
  );

  const onSearch = () => {
    if (token) {
      setDatasets([]);
      loadSearch();
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    terminateSearch();
    props.setSearchValue?.(e.target.value);
  };

  return (
    <>
      <div
        css={`
          display: flex;
          gap: 24px;
          @media (max-width: 881px) {
            margin-top: 40px;
          }
        `}
      >
        <div
          css={`
            border-radius: 20px;
            border: 0.5px solid #000;
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 0 16px;

            input {
              font-size: 14px;
              height: 40px;
              flex: 1;
              border: none;
              outline: none;
              background: transparent;
            }
          `}
        >
          <SearchIcon />
          <input
            type="text"
            placeholder="Search your dataset via Federated search"
            value={props.searchValue}
            onChange={handleSearch}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch();
              }
            }}
            data-cy="external-search-input"
            aria-label="search"
            name="search"
            autoComplete="search"
          />
        </div>

        <PrimaryButton
          bg="dark"
          size="small"
          css={`
            height: 41px;
            border-radius: 30px;
          `}
          onClick={onSearch}
          data-cy="external-search-button"
        >
          SEARCH
        </PrimaryButton>
      </div>
      <div
        css={`
          height: 16px;
        `}
      />
      <Grid container alignItems="center">
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          lg={6}
          css={`
            @media (max-width: 767px) {
              display: none;
            }
          `}
        >
          <SourceCategoryList
            sources={props.sources}
            setSources={props.setSources}
            baseSources={baseSources}
            terminateSearch={terminateSearch}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Filter
            searchValue={props.searchValue as string}
            setSortValue={setSortValue}
            setAssetsView={setView}
            sortValue={sortValue}
            assetsView={view}
            searchInputWidth="249px"
            searchIconCypressId="open-search-button"
            hasSearch={false}
          />
        </Grid>
      </Grid>

      <Box height={32} />
      {datasets?.length ? (
        <>
          {view === "grid" && (
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
                      searchValue={props.searchValue}
                    />
                    <Box height={16} />
                  </Grid>
                ))}
            </Grid>
          )}
          {view === "table" && (
            <ExternalSearchTable
              onItemClick={props.handleDownload}
              tableData={{
                columns: [
                  { key: "name", label: "Title" },
                  { key: "description", label: "Description" },
                  { key: "datePublished", label: "Date" },
                  { key: "source", label: "Source" },
                  { key: "download", label: "", icon: <ChevronRight /> },
                ],
                data: datasets,
              }}
            />
          )}
        </>
      ) : !loading ? (
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
      ) : null}

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
}
