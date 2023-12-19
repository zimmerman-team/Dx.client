/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
/* project */
import { useUpdateEffectOnce } from "app/hooks/useUpdateEffectOnce";
import { CHART_DEFAULT_WIDTH } from "app/modules/chart-module/data";
import { CommonChart } from "app/modules/chart-module/components/common-chart";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { ChartBuilderCustomizeProps } from "app/modules/chart-module/routes/customize/data";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { useStoreState } from "app/state/store/hooks";
import { useHistory, useParams } from "react-router-dom";

function ChartBuilderCustomize(props: Readonly<ChartBuilderCustomizeProps>) {
  useTitle("DX DataXplorer - Customize");
  const history = useHistory();
  const { page } = useParams<{ page: string }>();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dataset = useStoreState((state) => state.charts.dataset.value);
  useUpdateEffectOnce(() => {
    if (
      containerRef.current &&
      props.visualOptions?.width === CHART_DEFAULT_WIDTH
    ) {
      const tmpVisualOptions = {
        ...props.visualOptions,
        width: containerRef.current.clientWidth,
      };
      props.setVisualOptions(tmpVisualOptions);
    }
  }, [containerRef]);

  React.useEffect(() => {
    if (dataset === null && !props.loading) {
      history.push(`/chart/${page}/data`);
    }
  }, [dataset]);

  return (
    <div css={commonStyles.container}>
      <div css={commonStyles.innercontainer}>
        <div
          ref={containerRef}
          css={`
            width: calc(100% - 24px);
            height: calc(100vh - 425px);
          `}
        >
          <CommonChart
            containerRef={containerRef}
            renderedChart={props.renderedChart}
            visualOptions={props.visualOptions}
            setVisualOptions={props.setVisualOptions}
            renderedChartSsr={props.renderedChartSsr}
            renderedChartMappedData={props.renderedChartMappedData}
            setChartErrorMessage={props.setChartErrorMessage}
            setNotFound={props.setNotFound}
          />
        </div>
      </div>
    </div>
  );
}

export default withAuthenticationRequired(ChartBuilderCustomize);
