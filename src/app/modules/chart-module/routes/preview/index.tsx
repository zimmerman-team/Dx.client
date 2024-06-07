/* third-party */
import React from "react";
import useTitle from "react-use/lib/useTitle";
import { useStoreState } from "app/state/store/hooks";
/* project */
import { PageLoader } from "app/modules/common/page-loader";
import { styles as commonStyles } from "app/modules/chart-module/routes/common/styles";
import { FilterGroupModel } from "app/components/ToolBoxPanel/components/filters/data";
import { DatasetDataTable } from "app/modules/dataset-upload-module/component/data-table";
import { useHistory, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import ErrorComponent from "app/modules/chart-module/components/dialog/errrorComponent";

interface ChartBuilderPreviewProps {
  loading: boolean;
  data: {
    [key: string]: string | number | null;
  }[];
  stats: {
    name: string;
    type: "percentage" | "bar" | "unique";
    data: { name: string; value: number }[];
  }[];
  filterOptionGroups: FilterGroupModel[];
  loadDataset: (endpoint: string) => Promise<boolean>;
  dataTypes: never[];
  chartError: boolean;
  dataError: boolean;
  chartErrorMessage: string;
}

export function ChartBuilderPreview(props: ChartBuilderPreviewProps) {
  useTitle("DX DataXplorer - Preview Data");
  const history = useHistory();
  const { isAuthenticated, user } = useAuth0();
  const { page } = useParams<{ page: string }>();
  const datasetId = useStoreState((state) => state.charts.dataset.value);

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  React.useEffect(() => {
    if (datasetId === null && !props.loading && page === "new") {
      history.push(`/chart/${page}/data`);
    } else {
      props.loadDataset(datasetId!);
    }
  }, [datasetId]);

  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  if (!canChartEditDelete && page !== "new") {
    return (
      <>
        <div css="width: 100%; height: 100px;" />
        <NotAuthorizedMessageModule asset="chart" action="edit" />
      </>
    );
  }
  if (props.dataError) {
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
    <div css={commonStyles.container}>
      {props.loading && <PageLoader />}
      <div css={commonStyles.innercontainer}>
        <DatasetDataTable
          data={props.data}
          stats={props.stats}
          dataTypes={props.dataTypes}
          datasetId={datasetId!}
        />
      </div>
    </div>
  );
}
