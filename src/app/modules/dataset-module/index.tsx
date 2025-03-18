import React from "react";
import { useTitle } from "react-use";
import DatasetUploadSteps from "app/modules/dataset-module/routes/upload-module/upload-steps";
import { Route, Switch, useHistory, useParams } from "react-router-dom";
import DatasetDetail from "app/modules/dataset-module/routes/datasetDetail";
import EditMetaData from "app/modules/dataset-module/routes/edit";
import { NoMatchPage } from "app/modules/common/no-match-page";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import NotAvailableOnMobile from "app/modules/common/not-available";

export default function DatasetDetailModule() {
  useTitle("Dataxplorer - Datasets");
  const { page, view } = useParams<{ page: string; view?: string }>();

  const [datasetId, setDatasetId] = React.useState("");
  const isSmallScreen = useMediaQuery("(max-width:743px)"); //at this breakpoint, we limit user creation abilities
  const history = useHistory();
  React.useEffect(() => {
    if (isSmallScreen && view !== undefined) {
      history.push(`/dataset/${page}/not-available`);
    }
  }, [isSmallScreen]);
  return (
    <Switch>
      <Route exact path="/dataset/:page">
        <DatasetDetail />
      </Route>
      <Route exact path="/dataset/new/upload">
        <DatasetUploadSteps datasetId={datasetId} setDatasetId={setDatasetId} />
      </Route>
      <Route exact path="/dataset/:page/edit">
        <EditMetaData />
      </Route>
      <Route exact path="/dataset/:page/not-available">
        <NotAvailableOnMobile />
      </Route>
      <Route path="*">
        <NoMatchPage />
      </Route>
    </Switch>
  );
}
