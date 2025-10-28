import {
  isChartAIAgentActive,
  chartFromStoryAtom,
} from "app/state/recoil/atoms";
import { useHistory, useParams } from "react-router-dom";
import { useSetRecoilState, useRecoilState } from "recoil";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { useStoreActions } from "app/state/store/hooks";
import { ReactComponent as AddNewImage } from "app/modules/home-module/assets/add-img.svg";

export function CreateChartCard(props: {
  storyName: string;
  headerDetails: IHeaderDetails;
  framesArray: IFramesArray[];
  onSave: (type: "create" | "edit") => Promise<void>;
}) {
  const history = useHistory();

  const setIsAiSwitchActive = useSetRecoilState(isChartAIAgentActive);

  const { page, view } = useParams<{
    page: string;
    view: string;
  }>();

  const setDataset = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const setLoadedChart = useStoreActions(
    (state) => state.charts.ChartGet.setCrudData
  );
  const setCreateChartData = useStoreActions(
    (state) => state.charts.ChartCreate.setCrudData
  );

  const setChartFromStory = useRecoilState(chartFromStoryAtom)[1];

  const action = () => {
    setChartFromStory({
      state: true,
      view,
      page,
      action: "create",
      chartId: null,
    });
    setIsAiSwitchActive(true);
    setDataset(null);
    setLoadedChart(null);
    setCreateChartData(null);
    //save story before exiting
    props.onSave("edit");
    history.push("/chart/new/data");
  };
  return (
    <div>
      <button
        onClick={action}
        data-testid="create-chart-card"
        data-cy="story-panel-create-chart-card"
        css={`
          background: #f2f7fd;
          box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
          height: 125px;
          padding-left: 27px;
          display: flex;
          justify-content: flex-start;
          gap: 12px;
          align-items: center;
          position: relative;
          cursor: pointer;
          outline: none;
          border: none;
          width: 100%;
          &:hover {
            opacity: 0.8;
          }
          :focus-visible {
            border: 2px solid #231d2c;
          }
        `}
      >
        <div>
          <AddNewImage />
        </div>
        <div
          css={`
            border: 1px solid #231d2c;
            height: 49px;
            width: 0px;
          `}
        />

        <div
          css={`
            h1 {
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              color: #262c34;
              font-size: 18px;
              line-height: 20px;
              margin: 0;
              font-weight: bold;
              text-align: left;
            }
            p {
              font-family: "GothamNarrow", "Helvetica Neue", sans-serif;
              color: #495057;
              font-size: 10px;
              line-height: 15px;
              letter-spacing: 0.5px;
              margin: 0;
              margin-top: 4px;
            }
          `}
        >
          <h1>New chart</h1>
          <p>Create a new chart in your library</p>
        </div>
      </button>
    </div>
  );
}
