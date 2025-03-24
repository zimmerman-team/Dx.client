/* third-party */
import useTitle from "react-use/lib/useTitle";
/* project */
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderCustomizeProps } from "app/modules/chart-module/routes/customize/data";
import { useStoreState } from "app/state/store/hooks";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";
import { useParams } from "react-router-dom";
import AIIcon from "app/assets/icons/AIIcon";
import ChartArea from "app/modules/chart-module/components/chart-area";

function ChartBuilderCustomize(props: Readonly<ChartBuilderCustomizeProps>) {
  useTitle("Dataxplorer - Customise");

  const { page } = useParams<{ page: string; view?: string }>();
  const mapping = useStoreState((state) => state.charts.mapping.value);

  if (props.dataError || props.chartError) {
    return (
      <>
        <ErrorComponent
          chartErrorMessage={props.chartErrorMessage}
          dataError={props.dataError}
          chartError={props.chartError}
          page={page}
        />
      </>
    );
  }

  return (
    <ChartArea chartName={props.chartName}>
      <div
        ref={props.containerRef}
        css={`
          width: 100%;
          height: 100%;
        `}
      >
        <CommonChart
          containerRef={props.containerRef}
          renderedChart={props.renderedChart}
          visualOptions={props.visualOptions}
          setVisualOptions={props.setVisualOptions}
          renderedChartMappedData={props.renderedChartMappedData}
          setChartErrorMessage={props.setChartErrorMessage}
          setChartError={props.setChartError}
          renderedChartType={props.renderedChartType}
          mapping={mapping}
        />
      </div>
      <div
        css={`
          position: absolute;
          right: 0%;
          top: 4%;
          display: ${props.isAIAssistedChart ? "block" : "none"};
        `}
      >
        <AIIcon />
      </div>
    </ChartArea>
  );
}

export default ChartBuilderCustomize;
