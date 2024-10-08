import React from "react";
import { v4 } from "uuid";
import Box from "@material-ui/core/Box";
import { useRecoilState } from "recoil";
import { useParams } from "react-router-dom";
import useResizeObserver from "use-resize-observer";
import Container from "@material-ui/core/Container";
import { EditorState, RawDraftContentState, convertFromRaw } from "draft-js";
import { useTitle } from "react-use";
import { useAuth0 } from "@auth0/auth0-react";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { ReportModel, emptyReport } from "app/modules/report-module/data";
import { ReportEditViewProps } from "app/modules/report-module/views/edit/data";
import HeaderBlock from "app/modules/report-module/components/headerBlock";
import { NotAuthorizedMessageModule } from "app/modules/common/not-authorized-message";
import { ItemComponent } from "app/modules/report-module/components/order-container";
import { ReportElementsType } from "app/modules/report-module/components/right-panel-create-view";
import AddRowFrameButton from "app/modules/report-module/components/rowStructure/addRowFrameButton";
import { GridColumns } from "app/modules/report-module/components/grid-columns";

import {
  IRowFrameStructure,
  persistedReportStateAtom,
  reportContentContainerWidth,
} from "app/state/recoil/atoms";
import { IFramesArray } from "app/modules/report-module/views/create/data";
import RowFrame from "app/modules/report-module/components/rowStructure";
import TourGuide from "app/components/Dialogs/TourGuide";
import useCookie from "@devhammed/use-cookie";
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import { PageLoader } from "app/modules/common/page-loader";
import { handleDragOverScroll } from "app/utils/handleAutoScroll";
import {
  compareFramesArrayState,
  compareHeaderDetailsState,
} from "app/modules/report-module/views/edit/compareStates";
import PlaceHolder from "app/modules/report-module/components/placeholder";

function ReportEditView(props: Readonly<ReportEditViewProps>) {
  useTitle("DX Dataxplorer - Edit Report");

  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const { isAuthenticated, user } = useAuth0();
  const { ref, width } = useResizeObserver<HTMLDivElement>();
  const [tourCookie, setTourCookie] = useCookie("tourGuide", "true");
  const [openTour, setOpenTour] = React.useState(
    tourCookie && !props.isSaveEnabled
  );
  const [containerWidth, setContainerWidth] = useRecoilState(
    reportContentContainerWidth
  );
  const [isReportHeadingModified, setIsReportHeadingModified] =
    React.useState(false);
  const [persistedReportState] = useRecoilState(persistedReportStateAtom);
  const [rowStructureType, setRowStructuretype] =
    React.useState<IRowFrameStructure>({
      index: 0,
      rowType: "",
      disableAddRowStructureButton: false,
    });

  const fetchReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.fetch
  );

  const [isReportLoading, setIsReportLoading] = React.useState<boolean | null>(
    null
  );

  const loadingReportData = useStoreState(
    (state) => state.reports.ReportGet.loading
  );

  const clearReportData = useStoreActions(
    (actions) => actions.reports.ReportGet.clear
  );
  const reportData = useStoreState(
    (state) => (state.reports.ReportGet.crudData ?? emptyReport) as ReportModel
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

  function deleteFrame(id: string) {
    props.updateFramesArray((draft) => {
      const frameId = draft.findIndex((frame) => frame.id === id);

      draft.splice(frameId, 1);
    });
  }

  React.useEffect(() => {
    if (token) {
      fetchReportData({ token, getId: page });
    }
    return () => {
      clearReportData();
    };
  }, [page, token]);

  React.useEffect(() => {
    if (reportData.id !== page) {
      return;
    }
    if (props.localPickedCharts.length === 0) {
      const items = reportData.rows.map((rowFrame, index) =>
        rowFrame.items.filter((item) => typeof item === "string")
      ) as string[][];
      let pickedItems: string[] = [];

      for (const element of items) {
        pickedItems = [...pickedItems, ...element];
      }
    }
  }, [reportData]);

  React.useEffect(() => {
    if (width && width !== containerWidth) {
      setContainerWidth(width);
    }
  }, [width]);

  function handleEndReportTour() {
    setTourCookie("false", {
      expires: 31536000 * 20,
      domain: "",
      path: "",
      secure: false,
      httpOnly: false,
      maxAge: 0,
      sameSite: "",
    });
    setOpenTour(false);
  }

  const framesArrayFromReportData = () => {
    const frameArray: IFramesArray[] = reportData.rows?.map(
      (rowFrame, index) => {
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
        const content = rowFrame.items.map((item, index) => {
          return contentTypes[index] === "text"
            ? EditorState.createWithContent(convertFromRaw(item as any))
            : item;
        });
        const isDivider =
          content &&
          content.length === 1 &&
          content[0] === ReportElementsType.DIVIDER;
        const id = v4();

        return {
          id,
          structure: rowFrame.structure,
          frame: {
            rowIndex: index,
            rowId: id,
            type: isDivider ? "divider" : "rowFrame",
            forceSelectedType: rowFrame.structure ?? undefined,
            previewItems: content,
          },
          content,
          contentWidths: [...rowFrame.contentWidths?.widths] ?? [],
          contentHeights: [...rowFrame.contentHeights?.heights] ?? [],
          contentTypes,
        };
      }
    );
    return frameArray;
  };

  const headerDetailsFromReportData = () => {
    return {
      title: reportData.title,
      showHeader: reportData.showHeader,
      heading: reportData?.heading
        ? EditorState.moveFocusToEnd(
            EditorState.createWithContent(
              convertFromRaw(reportData?.heading as RawDraftContentState)
            )
          )
        : EditorState.moveFocusToEnd(EditorState.createEmpty()),
      description: reportData?.description
        ? EditorState.createWithContent(
            convertFromRaw(reportData?.description as RawDraftContentState)
          )
        : EditorState.createEmpty(),
      backgroundColor: reportData.backgroundColor,
      titleColor: reportData.titleColor,
      descriptionColor: reportData.descriptionColor,
      dateColor: reportData.dateColor,
      isUpdated: true,
    };
  };

  const hasChangesBeenMadeCheck = () => {
    if (reportData.id !== page) {
      return;
    }
    const areHeaderDetailsStatesEqual = compareHeaderDetailsState(
      props.headerDetails,
      headerDetailsFromReportData()
    );
    const areFramesArrayStatesEqual = compareFramesArrayState(
      props.framesArray,
      framesArrayFromReportData()
    );

    if (
      !areFramesArrayStatesEqual ||
      !areHeaderDetailsStatesEqual ||
      reportData.name !== props.reportName
    ) {
      props.setHasChangesBeenMade(true);
    }
    if (
      !isEqual(
        props.headerDetails.heading.getCurrentContent().getPlainText(),
        headerDetailsFromReportData().heading.getCurrentContent().getPlainText()
      )
    ) {
      setIsReportHeadingModified(true);
    }
  };

  React.useEffect(() => {
    hasChangesBeenMadeCheck();
    return () => {
      props.setHasChangesBeenMade(false);
      setIsReportHeadingModified(false);
    };
  }, [
    props.framesArray,
    props.reportName,
    props.headerDetails,
    props.autoSave,
  ]);

  const updateReportStatesWithReportData = async () => {
    if (reportData.id !== page) {
      return;
    }
    props.setHasReportNameFocused(reportData.name !== "Untitled report");
    props.setReportName(reportData.name);
    props.setHeaderDetails(headerDetailsFromReportData());
    props.updateFramesArray(framesArrayFromReportData());
  };

  React.useEffect(() => {
    updateReportStatesWithReportData().finally(() => {
      props.setAutoSave({ isAutoSaveEnabled: true });
    });
  }, [reportData]);

  React.useEffect(() => {
    if (!loadingReportData && isReportLoading === null) {
      return;
    }
    setIsReportLoading(loadingReportData);
  }, [loadingReportData]);

  const canEditDeleteReport = React.useMemo(() => {
    return isAuthenticated && reportData?.owner === user?.sub;
  }, [user, isAuthenticated, reportData]);

  if (loadingReportData || isReportLoading === null) {
    return <PageLoader />;
  }

  if (reportError401) {
    return (
      <>
        <Box height={48} />
        <NotAuthorizedMessageModule
          asset="report"
          action="edit"
          name={errorReportName}
        />
      </>
    );
  }

  if (!canEditDeleteReport && !loadingReportData) {
    return (
      <>
        <Box height={48} />
        <NotAuthorizedMessageModule
          asset="report"
          action="edit"
          name={reportData?.name}
        />
        ;
      </>
    );
  }

  return (
    <div onDragOver={handleDragOverScroll}>
      <div
        css={`
          height: 55px;
          transition: all cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
        `}
      />
      <HeaderBlock
        previewMode={false}
        headerDetails={{
          ...props.headerDetails,
        }}
        reportName={reportData.name}
        setReportName={props.setReportName}
        hasReportNameFocused={props.hasReportNameFocused}
        sethasReportNameFocused={props.setHasReportNameFocused}
        setHeaderDetails={props.setHeaderDetails}
        setPlugins={props.setPlugins}
        isToolboxOpen={props.rightPanelOpen}
        handleRightPanelOpen={props.handleRightPanelOpen}
        isReportHeadingModified={isReportHeadingModified}
      />
      <Container maxWidth="lg">
        <div
          ref={ref}
          id="content-container"
          css={`
            transition: width 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
            width: ${props.rightPanelOpen
              ? "calc(100vw - ((100vw - 1280px) / 2) - 400px - 50px)"
              : "100%"};
            position: relative;
          `}
        >
          <Box height={50} />
          <TourGuide
            reportType={props.reportType ?? "basic"}
            toolBoxOpen={props.rightPanelOpen}
            handleClose={handleEndReportTour}
            open={openTour}
          />

          {props.framesArray?.map((frame, index) => {
            return (
              <div key={frame.id} data-cy={`row-frame-container-${index}`}>
                {index === 0 && (
                  <PlaceHolder
                    index={index}
                    rowId={frame.id}
                    deleteFrame={deleteFrame}
                    framesArray={props.framesArray}
                    updateFramesArray={props.updateFramesArray}
                  />
                )}
                <Box height={8} />
                <ItemComponent
                  id={frame.id}
                  index={index}
                  childrenData={props.framesArray}
                >
                  <div
                    css={`
                      position: relative;
                    `}
                  >
                    <RowFrame
                      {...frame.frame}
                      framesArray={props.framesArray}
                      updateFramesArray={props.updateFramesArray}
                      view={props.view}
                      rowContentHeights={frame.contentHeights}
                      rowContentWidths={frame.contentWidths}
                      setPlugins={props.setPlugins}
                      onSave={props.onSave}
                      endReportTour={handleEndReportTour}
                    />
                  </div>
                </ItemComponent>
                <div
                  css={`
                    height: 20px;
                  `}
                />

                <PlaceHolder
                  rowId={frame.id}
                  deleteFrame={deleteFrame}
                  framesArray={props.framesArray}
                  updateFramesArray={props.updateFramesArray}
                />
              </div>
            );
          })}

          <Box height={8} />
          <AddRowFrameButton
            framesArray={props.framesArray}
            rowStructureType={rowStructureType}
            updateFramesArray={props.updateFramesArray}
            setRowStructureType={setRowStructuretype}
            endTour={handleEndReportTour}
          />
          <Box height={45} />
          <GridColumns />
        </div>
      </Container>
    </div>
  );
}

export default ReportEditView;
