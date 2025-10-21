import Skeleton from "@material-ui/lab/Skeleton";
import SearchIcon from "@material-ui/icons/Search";
import { useInfinityScroll } from "app/hooks/useInfinityScroll";

import { TABLET_STARTPOINT } from "app/theme";
import React from "react";
import { sortByOptions, StoryElementsType } from ".";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { IChartDetail } from "./data";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import get from "lodash/get";
import { useDebounce } from "react-use";
import { CreateChartCard } from "./createChartCard";
import ChartItem from "./chartItem";
import { Button, StyledMenu, StyledMenuItem } from "./elementItem";

export default function ChartList(
  props: Readonly<{
    headerDetails: IHeaderDetails;
    framesArray: IFramesArray[];
    storyName: string;
    onSave: (type: "create" | "edit") => Promise<void>;
  }>
) {
  const token = useStoreState((state) => state.AuthToken.value);

  const [searchValue, setSearchValue] = React.useState("");
  const [sortBy, setSortBy] = React.useState(sortByOptions[0]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [loadedCharts, setLoadedCharts] = React.useState<IChartDetail[]>([]);
  const chartList = useStoreState(
    (state) => (state.charts.ChartGetList.crudData || []) as IChartDetail[]
  );
  const loadChartList = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );

  const chartsLoadSuccess = useStoreState(
    (state) => state.charts.ChartGetList.success
  );

  const loadChartsCount = useStoreActions(
    (actions) => actions.charts.ChartsCount.fetch
  );
  const chartsCount = useStoreState(
    (state) => get(state, "charts.ChartsCount.data.count", 0) as number
  );

  const loading = useStoreState((state) => state.charts.ChartGetList.loading);

  const limit = 10;

  const [offset, setOffset] = React.useState(0);

  const observerTarget = React.useRef(null);
  const { isObserved } = useInfinityScroll(observerTarget);
  const reset = () => {
    setLoadedCharts([]);
    setOffset(0);
  };
  const search = async (newPage?: boolean) => {
    const realOffset = newPage ? offset + limit : 0;
    if (!newPage) {
      reset();
    }
    loadChartList({
      token,
      storeInCrudData: true,
      filterString: `filter={"where":{"name":{"like":"${searchValue}.*","options":"i"}},"order":"${sortBy.value}","limit":${limit},"offset":${realOffset}}`,
    });
    if (newPage) {
      setOffset(realOffset);
    }
  };

  // Pagination on scroll
  React.useEffect(() => {
    if (
      isObserved &&
      loadedCharts.length > 0 &&
      loadedCharts.length < chartsCount
    ) {
      search(true);
    }
  }, [isObserved]);

  React.useEffect(() => {
    if (!chartsLoadSuccess) {
      return;
    }
    //update the loaded stories
    setLoadedCharts((prevCharts) => {
      const prevChartsIds = prevCharts.map((c) => c.id);
      const f = chartList.filter((chart) => !prevChartsIds.includes(chart.id));
      return [...prevCharts, ...f];
    });
  }, [chartsLoadSuccess]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useDebounce(
    () => {
      loadChartsCount({
        token,
        filterString: `${
          searchValue.length > 0
            ? `where={"name":{"like":"${searchValue}.*","options":"i"}}`
            : ""
        }`,
      });
      search();
    },
    500,
    [token, searchValue, sortBy]
  );

  return (
    <React.Fragment>
      <div
        css={`
          width: 100%;
          gap: 8px;
          display: flex;
          padding: 12px 23px;
          position: relative;
          flex-direction: row;
          @media (min-width: ${TABLET_STARTPOINT}) and (max-width: 1090px) {
            flex-wrap: wrap;
            justify-content: flex-end;
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 8px;
            width: 187px;
            height: 35px;
            background: #dfe3e6;
            border-radius: 24px;
            padding: 0 8px;
            @media (min-width: ${TABLET_STARTPOINT}) and (max-width: 1090px) {
              width: 100%;
            }
          `}
        >
          <input
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
            data-cy="story-panel-chart-search-input"
            value={searchValue}
            css={`
              width: 100%;
              height: 100%;
              border-style: none;
              background: transparent;
            `}
          />
          <SearchIcon htmlColor="#495057" />
        </div>
        <Button
          disableTouchRipple
          onClick={handleClick}
          css={`
            width: 159px;
            height: 35px;
            border-radius: 24px;
            background: #231d2c;
            text-transform: capitalize;
            padding-left: 16px;
            display: flex;
            svg {
              margin-left: 10px;
              transition: all 0.2s ease-in-out;
              transform: rotate(${anchorEl ? "180" : "0"}deg);
              > path {
                fill: #fff;
              }
            }
            @media (max-width: ${TABLET_STARTPOINT}) {
              justify-self: flex-end;
            }
          `}
        >
          <span
            css={`
              color: #fff;
              font-size: 14px;
              overflow: hidden;
              font-weight: 325;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            `}
          >
            Sort by {sortBy.label}
          </span>
          <KeyboardArrowDownIcon />
        </Button>
        <StyledMenu
          keepMounted
          anchorEl={anchorEl}
          id="breadcrumb-menu"
          onClose={handleClose}
          open={Boolean(anchorEl)}
        >
          {sortByOptions.map((option) => (
            <StyledMenuItem
              key={option.value}
              onClick={() => {
                setSortBy(option);
                handleClose();
              }}
            >
              {option.label}
            </StyledMenuItem>
          ))}
        </StyledMenu>
      </div>
      <div
        css={`
          gap: 18px;
          width: 100%;
          display: flex;
          overflow-y: auto;
          padding: 0px 23px;
          margin-top: 8px;
          margin-bottom: 16px;

          flex-direction: column;

          height: calc(100vh - 48px - 50px - 52px - 60px);
          max-height: calc(100vh - 48px - 50px - 52px - 60px);

          &::-webkit-scrollbar {
            width: 5px;
            border-radius: 6px;
            background: #231d2c;
          }
          &::-webkit-scrollbar-track {
            background: #f2f7fd;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: #231d2c;
          }
        `}
      >
        <CreateChartCard
          headerDetails={props.headerDetails}
          framesArray={props.framesArray}
          storyName={props.storyName}
          onSave={props.onSave}
        />
        {loadedCharts
          .filter((c) => c.isMappingValid)
          .map((chart, index) => (
            <ChartItem
              chartIndex={index}
              id={chart.id}
              key={chart.id}
              name={chart.name}
              vizType={chart.vizType}
              datasetId={chart.datasetId}
              createdDate={chart.createdDate}
              framesArray={props.framesArray}
              isAIAssistedChart={chart.isAIAssisted}
              elementType={
                (chart.vizType === "bigNumber"
                  ? StoryElementsType.BIG_NUMBER
                  : StoryElementsType.CHART) as "chart" | "bigNumber"
              }
            />
          ))}
        {loading
          ? Array(4)
              .fill(null)
              .map((_d, index: number) => (
                <Skeleton
                  animation="wave"
                  variant="rect"
                  width="100%"
                  height="125px"
                  key={`${index}-skeleton`}
                />
              ))
          : null}
        <div
          css={`
            height: 1px;
          `}
          ref={observerTarget}
        />
      </div>
    </React.Fragment>
  );
}
