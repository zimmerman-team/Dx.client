import React from "react";
import get from "lodash/get";
import CloseIcon from "@material-ui/icons/Close";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
import { Box } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import ToolboxSubHeader from "app/modules/chart-module/components/toolbox/steps/sub-header";
import { useRecoilValue, useResetRecoilState } from "recoil";
import {
  chartFromStoryAtom,
  isChartAutoMappedAtom,
} from "app/state/recoil/atoms";
import { PrimaryButton } from "app/components/Styled/button";

export interface IDatasetDetails {
  id: string;
  name: string;
  description: string;
  public: boolean;
  category: string;
  source: string;
  sourceUrl: string;
  owner: string;
  createdDate: string; // Date string in ISO 8601 format
  updatedDate: string; // Date string in ISO 8601 format
  authId: string;
}
export function DatasetPanel(props: { deselectDataset: () => void }) {
  return (
    <>
      <ToolboxSubHeader
        name="Please select a dataset to use"
        level={1}
        tooltip="Please choose your data in order to create a chart."
      />
      <Box height={16} />

      <div
        css={`
          display: flex;
          flex-direction: column;
          align-items: center;
        `}
      >
        <ChartToolBoxSelectDataset deselectDataset={props.deselectDataset} />
        <Box height={16} />
        <ConnectData />
      </div>
    </>
  );
}

function ChartToolBoxSelectDataset(props: { deselectDataset: () => void }) {
  const { page } = useParams<{ page: string }>();
  const history = useHistory();
  const token = useStoreState((state) => state.AuthToken.value);

  const dataset = useStoreState((state) => state.charts.dataset.value);
  const fetchDatasetdetails = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) => state.dataThemes.DatasetGet.crudData
  ) as IDatasetDetails;
  const clearChartSuggestionsCrudData = useStoreActions(
    (actions) => actions.charts.ChartTypesSuggest.clear
  );
  const resetIsChartAutoMapped = useResetRecoilState(isChartAutoMappedAtom);

  React.useEffect(() => {
    if (token && dataset) {
      fetchDatasetdetails({
        token,
        storeInCrudData: true,
        getId: dataset as string,
      });
    }
  }, [dataset]);

  const handleDeselectDataset = () => {
    clearChartSuggestionsCrudData();
    resetIsChartAutoMapped();
    props.deselectDataset();
    history.push(`/chart/${page}/data`);
  };
  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 351px;
        height: 89px;
        border-radius: 11px;
        background: #dfe3e5;

        > p {
          margin-bottom: 4px;
          margin-top: -8px;
          color: #231d2c;
          font-size: 14px;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
        }

        > label {
          margin: 0;
          width: 100%;
          display: flex;
          justify-content: space-between;

          > span {
            font-size: 14px;
          }
        }
      `}
    >
      <p>Please select a dataset</p>
      <button
        title={get(datasetDetails, "name", "Select data from the list")}
        css={`
          width: 100%;
          font-size: 14px;
          border-radius: 24px;
          text-transform: capitalize;
          display: flex;
          justify-content: ${datasetDetails?.name ? "space-between" : "center"};
          align-items: center;
          border-radius: 25px;
          background: #231d2c;
          outline: none;
          border: none;
          color: #fff;
          ${!datasetDetails?.name &&
          "border: 0.722px dashed #231D2C;background: #DFE3E5; color:#868E96"};
          width: 313px;
          height: 31px;
          padding: 0 16px;
          svg {
            margin-left: 10px;
            > path {
              fill: #fff;
            }
          }
          span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            &:nth-child(1) {
              width: 98%;
              display: flex;
              justify-content: flex-start;
            }
          }
        `}
      >
        <span data-cy="toolbox-selected-dataset">
          {get(datasetDetails, "name", "Select data from the list")}
        </span>
        <span
          onClick={handleDeselectDataset}
          css={`
            margin-top: 2px;
            cursor: pointer;
            display: ${datasetDetails?.name ? "block" : "none"};
          `}
        >
          <CloseIcon />
        </span>
      </button>
    </div>
  );
}

const ConnectData = () => {
  const history = useHistory();
  const chartFromStory = useRecoilValue(chartFromStoryAtom);
  return (
    <div
      css={`
        width: 351px;
        height: 97px;
        border-radius: 11px;
        background: #dfe3e5;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        p {
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          margin-bottom: 4px;
          margin-top: -8px;
          font-size: 14px;
        }
      `}
    >
      <p>Or connect new data</p>
      <PrimaryButton
        size="small"
        bg="dark"
        onClick={() =>
          history.push(
            `/dataset/new/upload${
              chartFromStory.state
                ? `?fromstory=true&page=${chartFromStory.page}`
                : ""
            }`
          )
        }
      >
        add new dataset
      </PrimaryButton>
    </div>
  );
};
