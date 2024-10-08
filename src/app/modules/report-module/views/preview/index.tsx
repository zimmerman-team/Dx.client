import React from "react";
import get from "lodash/get";
import { useRecoilState } from "recoil";
import Box from "@material-ui/core/Box";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useResizeObserver from "use-resize-observer";
import Container from "@material-ui/core/Container";
import { EditorState, convertFromRaw } from "draft-js";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import RowFrame from "app/modules/report-module/components/rowStructure";
import HeaderBlock from "app/modules/report-module/components/headerBlock";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import {
  persistedReportStateAtom,
  reportContentContainerWidth,
  unSavedReportPreviewModeAtom,
} from "app/state/recoil/atoms";
import { linkDecorator } from "app/modules/common/RichEditor/decorators";
import { useTitle } from "react-use";
import ReportUsePanel from "../../components/use-report-panel";
import HomeFooter from "app/modules/home-module/components/Footer";
import { PageLoader } from "app/modules/common/page-loader";

export function ReportPreviewView(props: {
  setIsPreviewView: React.Dispatch<React.SetStateAction<boolean>>;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
}) {
  const previewMode = location.pathname.endsWith("preview");
  useTitle(`DX DataXplorer - Report ${previewMode ? "Preview" : "View"}`);

  const { page } = useParams<{ page: string }>();

  const { isLoading, isAuthenticated } = useAuth0();

  const { ref, width } = useResizeObserver<HTMLDivElement>();

  const persistedReportState = useRecoilState(persistedReportStateAtom)[0];
  const reportPreviewMode = useRecoilState(unSavedReportPreviewModeAtom)[0];

  const [containerWidth, setContainerWidth] = useRecoilState(
    reportContentContainerWidth
  );

  const token = useStoreState((state) => state.AuthToken.value);

  const reportData = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
  );

  const [isReportLoading, setIsReportLoading] = React.useState<boolean | null>(
    null
  );
  const loadingReportData = useStoreState(
    (state) => state.reports.ReportGet.loading
  );

  const reportError401 = useStoreState(
    (state) =>
      get(state.reports.ReportGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.reports.ReportGet.crudData, "error", "") === "Unauthorized"
  );

  const errorReportName = useStoreState((state) =>
    get(state.reports.ReportGet.crudData, "name", "")
  );

  const fetchReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.fetch
  );
  const clearReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.clear
  );

  const reportEditClear = useStoreActions(
    (actions) => actions.reports.ReportUpdate.clear
  );

  const reportCreateClear = useStoreActions(
    (actions) => actions.reports.ReportCreate.clear
  );

  const reportGetClear = useStoreActions(
    (actions) => actions.reports.ReportGet.clear
  );

  const [reportPreviewData, setReportPreviewData] = React.useState(reportData);

  React.useEffect(() => {
    props.setAutoSave({ isAutoSaveEnabled: false });
    if (!isLoading) {
      if (token) {
        fetchReportData({ token, getId: page });
      } else if (!isAuthenticated) {
        fetchReportData({ nonAuthCall: true, getId: page });
      }
    }
    return () => {
      clearReportData();
    };
  }, [page, token, isLoading, isAuthenticated]);

  React.useEffect(() => {
    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [width]);

  React.useEffect(() => {
    if (!reportPreviewMode) {
      setReportPreviewData(reportData);
    }
  }, [reportData]);

  React.useEffect(() => {
    props.setIsPreviewView(true);
    return () => {
      reportGetClear();
      reportEditClear();
      reportCreateClear();
      props.setIsPreviewView(false);
    };
  }, []);

  React.useEffect(() => {
    if (reportPreviewMode) {
      setReportPreviewData({
        ...reportPreviewData,

        title: JSON.parse(persistedReportState.headerDetails.title),
        showHeader: persistedReportState.headerDetails.showHeader,
        backgroundColor: persistedReportState.headerDetails.backgroundColor,
        titleColor: persistedReportState.headerDetails.titleColor,
        descriptionColor: persistedReportState.headerDetails.descriptionColor,
        dateColor: persistedReportState.headerDetails.dateColor,
        rows: JSON.parse(persistedReportState.framesArray || "[]"),
        description: JSON.parse(persistedReportState.headerDetails.description),
        heading: JSON.parse(persistedReportState.headerDetails.heading),
      });
    }
  }, [persistedReportState]);

  React.useEffect(() => {
    if (!loadingReportData && isReportLoading === null) {
      return;
    }
    setIsReportLoading(loadingReportData);
  }, [loadingReportData]);

  if (loadingReportData || isReportLoading === null) {
    return <PageLoader />;
  }

  if (reportError401) {
    return (
      <>
        <Box height={48} />
        <NotAuthorizedMessageModule
          asset="report"
          action="view"
          name={errorReportName}
        />
      </>
    );
  }

  return (
    <div
      id="export-container"
      css={`
        background: white;
      `}
    >
      <HeaderBlock
        isToolboxOpen={false}
        previewMode={true}
        headerDetails={{
          title: reportPreviewData.title,
          showHeader: reportPreviewData.showHeader,
          heading: EditorState.createWithContent(
            convertFromRaw(reportPreviewData.heading ?? emptyReport.heading)
          ),
          description: EditorState.createWithContent(
            convertFromRaw(
              reportPreviewData.description ?? emptyReport.description
            )
          ),
          backgroundColor: reportPreviewData.backgroundColor,
          titleColor: reportPreviewData.titleColor,
          descriptionColor: reportPreviewData.descriptionColor,
          dateColor: reportPreviewData.dateColor,
        }}
        setPlugins={() => {}}
        setHeaderDetails={() => {}}
        handleRightPanelOpen={() => {}}
      />
      <Container id="content-container" maxWidth="lg" ref={ref}>
        <Box height={45} />

        {!reportError401 &&
          get(reportPreviewData, "rows", []).map((rowFrame, index) => {
            const contentTypes = rowFrame.items.map((item) => {
              if (item === null) {
                return null;
              }
              if (get(item, "embedUrl", null)) {
                return "video";
              } else if (get(item, "imageUrl", null)) {
                return "image";
              } else if (typeof item === "object") {
                return "text";
              } else {
                return "chart";
              }
            });
            if (
              rowFrame.items &&
              rowFrame.items.length === 1 &&
              rowFrame.items[0] === ReportElementsType.DIVIDER
            ) {
              return (
                <div
                  key={"divider" + `${index}`}
                  css={`
                    margin: 0 0 16px 0;
                    height: 2px;
                    width: 100%;
                    background-color: #cfd4da;
                  `}
                />
              );
            }

            return (
              <RowFrame
                rowId=""
                view="preview"
                type="rowFrame"
                rowIndex={index}
                framesArray={[]}
                setPlugins={() => {}}
                updateFramesArray={() => {}}
                key={"rowframe" + `${index}`}
                endReportTour={() => {}}
                onSave={async () => {}}
                forceSelectedType={rowFrame.structure ?? undefined}
                previewItems={rowFrame.items.map((item, index) => {
                  return contentTypes[index] === "text"
                    ? EditorState.createWithContent(
                        convertFromRaw(item as any),
                        linkDecorator
                      )
                    : item;
                })}
                rowContentHeights={
                  rowFrame.contentHeights?.heights ?? rowFrame.contentHeights
                }
                rowContentWidths={
                  rowFrame.contentWidths?.widths ?? rowFrame.contentWidths
                }
              />
            );
          })}
        <Box height={16} />
      </Container>

      {location.search.includes("?fromLanding=true") && !isAuthenticated ? (
        <ReportUsePanel />
      ) : null}

      {!previewMode ? (
        <>
          <Box height={71} /> <HomeFooter />
        </>
      ) : null}
    </div>
  );
}
