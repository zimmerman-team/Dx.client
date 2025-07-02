import React from "react";
import { v4 } from "uuid";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { DndProvider } from "react-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useImmer } from "use-immer";
import { useAuth0 } from "@auth0/auth0-react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { NoMatchPage } from "app/modules/common/no-match-page";
import StoryEditView from "app/modules/story-module/views/edit";
import AITemplate from "app/modules/story-module/views/ai-template";
import { EditorState, convertToRaw } from "draft-js";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { StoryModel, emptyStory } from "app/modules/story-module/data";
import { StoryPreviewView } from "app/modules/story-module/views/preview";
import StoryInitialView from "app/modules/story-module/views/initial";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { StoryRightPanel } from "app/modules/story-module/components/right-panel";
import {
  Route,
  Switch,
  useHistory,
  useParams,
  Redirect,
} from "react-router-dom";
import {
  planDialogAtom,
  storyRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { StorySubheaderToolbar } from "app/modules/story-module/components/storySubHeaderToolbar";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import DownloadedView from "./views/downloaded-view";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import NotAvailableOnMobile from "app/modules/common/not-available";
import { MOBILE_BREAKPOINT } from "app/theme";
import { decorators } from "app/modules/common/RichEditor/decorators";
import { createHeadingEditorState } from "app/utils/draftjs/createEditorStateWithBlockType";
import { useEditorPlugins } from "app/hooks/useEditorPlugins";

export default function StoryModule() {
  const { user, isAuthenticated } = useAuth0();
  const isSmallScreen = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT})`); //at this breakpoint, we limit user creation abilities
  const history = useHistory();
  const aiTemplateString = "ai-template";
  const { page, view } = useParams<{
    page: string;
    view: "initial" | "edit" | "create" | "preview" | typeof aiTemplateString;
  }>();

  const [autoSave, setAutoSave] = React.useState<{
    isAutoSaveEnabled: boolean;
  }>({ isAutoSaveEnabled: false });

  const setPlanDialog = useSetRecoilState(planDialogAtom);
  const [plugins, setPluginsState] = React.useState<ToolbarPluginsType>([]);
  const token = useStoreState((state) => state.AuthToken.value);
  const [_rightPanelView, setRightPanelView] = useRecoilState(
    storyRightPanelViewAtom
  );
  const [isPreviewView, setIsPreviewView] = React.useState(false);
  const defaultStoryTitle = "Untitled story";
  const [rightPanelOpen, setRightPanelOpen] = React.useState(true);
  const [storyName, setStoryName] = React.useState("Untitled story");
  const [hasStoryNameFocused, setHasStoryNameFocused] = React.useState(false);
  const [hasStoryNameBlurred, setHasStoryNameBlurred] = React.useState(false);

  const [storyType, setStoryType] = React.useState<
    "basic" | "advanced" | "ai" | null
  >(null);

  const clearChart = useStoreActions(
    (actions) => actions.charts.ChartGet.clear
  );

  const resetDataset = useStoreActions(
    (actions) => actions.charts.dataset.reset
  );
  const resetChartType = useStoreActions(
    (actions) => actions.charts.chartType.reset
  );
  const resetMapping = useStoreActions(
    (actions) => actions.charts.mapping.reset
  );

  const storyGetData = useStoreState(
    (state) => (state.stories.StoryGet.crudData ?? emptyStory) as StoryModel
  );

  const storyCreate = useStoreActions(
    (actions) => actions.stories.StoryCreate.post
  );

  const storyCreateClear = useStoreActions(
    (actions) => actions.stories.StoryCreate.clear
  );

  const storyEdit = useStoreActions(
    (actions) => actions.stories.StoryUpdate.patch
  );

  const storyEditClear = useStoreActions(
    (actions) => actions.stories.StoryUpdate.clear
  );

  const fetchStoryData = useStoreActions(
    (actions) => actions.stories.StoryGet.fetch
  );

  const storyError401 = useStoreState(
    (state) =>
      get(state.stories.StoryGet.errorData, "data.error.statusCode", 0) ===
        401 ||
      get(state.stories.StoryGet.crudData, "error", "") === "Unauthorized"
  );

  const storyCreateData = useStoreState(
    (state) => state.stories.StoryCreate.crudData as any
  );

  const { plugins: localPlugins } = useEditorPlugins();

  React.useEffect(() => {
    if (storyCreateData?.error && storyCreateData?.errorType === "planError") {
      setPlanDialog({
        open: true,
        message: storyCreateData?.error,
        tryAgain: "",
        onTryAgain: () => {},
      });
    }
  }, [storyCreateData]);

  const storyPlanWarning = useStoreState(
    (state) => state.stories.StoryCreate.planWarning
  );

  React.useEffect(() => {
    setPluginsState(localPlugins);
  }, []);

  React.useEffect(() => {
    if (isSmallScreen && view === "edit") {
      history.push(`/story/${page}/not-available`);
    }
  }, [isSmallScreen]);

  React.useEffect(() => {
    if (storyPlanWarning) {
      setPlanDialog({
        open: true,
        message: storyPlanWarning,
        tryAgain: "",
        onTryAgain: () => {},
      });
    }
  }, [storyPlanWarning]);

  const [headerDetails, setHeaderDetails] = React.useState({
    title: "",
    description: EditorState.createEmpty(decorators()),
    heading: createHeadingEditorState(),
    showHeader: true,
    backgroundColor: "#252c34",
    titleColor: "#ffffff",
    descriptionColor: "#ffffff",
    dateColor: "#ffffff",
  });

  const [stopInitializeFramesWidth, setStopInitializeFramesWidth] =
    React.useState(false);

  React.useEffect(() => {
    //set story name back to untitled story if it is empty and user is not focused on subheader title
    if (storyName === "" && hasStoryNameBlurred) {
      setStoryName(defaultStoryTitle);
    }
    return () => {
      setHasStoryNameBlurred(false);
    };
  }, [hasStoryNameBlurred]);

  const basicStoryInitialState = () => {
    const id = v4();
    return [
      {
        id,
        frame: {
          rowId: id,
          type: "rowFrame",
        },
        content: [],
        contentWidths: [],
        contentHeights: [],
        contentTypes: [],
        structure: null,
      },
    ] as IFramesArray[];
  };

  const advancedStoryInitialState = () => {
    const rowOne = v4();
    const rowTwo = v4();
    const rowFive = v4();
    return [
      {
        id: rowOne,
        frame: {
          rowId: rowOne,
          forceSelectedType: "oneByFive",

          type: "rowFrame",
        },
        content: [null, null, null, null, null],
        contentWidths: [20, 20, 20, 20, 20],
        contentHeights: [121, 121, 121, 121, 121],
        contentTypes: [null, null, null, null, null],
        structure: "oneByFive",
      },
      {
        id: rowTwo,
        frame: {
          rowId: rowTwo,
          forceSelectedType: "oneByOne",

          type: "rowFrame",
        },
        content: [null],
        contentWidths: [100],
        contentHeights: [400],
        contentTypes: [null],
        structure: "oneByOne",
      },

      {
        id: rowFive,
        frame: {
          rowId: rowFive,
          forceSelectedType: "oneByThree",

          type: "rowFrame",
        },
        content: [null, null, null],
        contentWidths: [33, 33, 33],
        contentHeights: [460, 460, 460],
        contentTypes: [null, null, null],
        structure: "oneByThree",
      },
    ] as IFramesArray[];
  };

  const initialFramesArray = React.useMemo(() => {
    if (storyType === "basic") {
      return basicStoryInitialState();
    } else if (storyType === "advanced") {
      return advancedStoryInitialState();
    }
    return [];
  }, [storyType]);

  const [framesArray, updateFramesArray] =
    useImmer<IFramesArray[]>(initialFramesArray);
  const [undoStack, setUndoStack] = React.useState<IFramesArray[][]>([
    framesArray,
  ]);
  console.log(undoStack, "undoStack");
  console.log(framesArray, "framesArray");
  const [redoStack, setRedoStack] = React.useState<IFramesArray[][]>([]);

  React.useEffect(() => {
    if (view === "edit" && !rightPanelOpen) {
      setRightPanelOpen(true);
    }
  }, [view]);

  React.useEffect(() => {
    return () => {
      resetDataset();
      resetChartType();
      storyEditClear();
      storyCreateClear();
      resetMapping();
      clearChart();
      setRightPanelView("charts");
      updateFramesArray([]);
    };
  }, []);

  const resetStory = () => {
    updateFramesArray(initialFramesArray);
    setHeaderDetails({
      title: "",
      heading: createHeadingEditorState(),
      description: EditorState.createEmpty(decorators()),
      showHeader: true,
      backgroundColor: "#252c34",
      titleColor: "#ffffff",
      descriptionColor: "#ffffff",
      dateColor: "#ffffff",
    });
    setStoryName(defaultStoryTitle);
    setRightPanelView("charts");
    setRightPanelOpen(true);
    setAutoSave({ isAutoSaveEnabled: false });
  };

  const onSave = async (type: "create" | "edit") => {
    const action = type === "create" ? storyCreate : storyEdit;
    await action({
      token,
      patchId: page === "new" ? "public" : page,
      values: {
        name: storyName,
        authId: user?.sub,
        showHeader: headerDetails.showHeader,
        title: headerDetails.showHeader ? headerDetails.title : undefined,
        heading: convertToRaw(
          headerDetails.showHeader
            ? headerDetails.heading.getCurrentContent()
            : EditorState.createEmpty(decorators()).getCurrentContent()
        ),
        description: convertToRaw(
          headerDetails.showHeader
            ? headerDetails.description.getCurrentContent()
            : EditorState.createEmpty(decorators()).getCurrentContent()
        ),
        rows: framesArray.map((frame) => ({
          structure: frame.structure,
          items: frame.content.map((item, index) =>
            frame.contentTypes[index] === "text"
              ? convertToRaw((item as EditorState).getCurrentContent())
              : item
          ),
          contentWidths: {
            id: frame.id,
            widths: frame.contentWidths,
          },
          contentHeights: {
            id: frame.id,
            heights: frame.contentHeights,
          },
        })),
        backgroundColor: headerDetails.backgroundColor,
        titleColor: headerDetails.titleColor,
        descriptionColor: headerDetails.descriptionColor,
        dateColor: headerDetails.dateColor,
      },
    });
    fetchStoryData({ token, getId: page, silent: true });
  };

  const handleSetButtonActive = (type: "basic" | "advanced" | "ai") => {
    if (type === "ai") {
      history.push(`/story/${page}/ai-template`);
    } else if (type === "basic") {
      updateFramesArray(basicStoryInitialState());
    } else if (type === "advanced") {
      updateFramesArray(advancedStoryInitialState());
    }

    setStoryType(type);
  };
  React.useEffect(() => {
    if (storyType === "advanced" || storyType === "basic") {
      onSave("create");
    }
    return () => {
      setStoryType(null);
    };
  }, [storyType]);

  const isSaveEnabled = React.useMemo(() => {
    let hasTextValue = !(
      storyName === defaultStoryTitle &&
      !headerDetails.description.getCurrentContent().hasText() &&
      isEmpty(headerDetails.title) &&
      framesArray.length === 1
    );

    let framesArrayState = framesArray.some(
      (frame) =>
        frame.content.length !== 0 ||
        frame.contentTypes.length !== 0 ||
        frame.structure !== null
    );
    return hasTextValue || framesArrayState;
  }, [storyName, framesArray, headerDetails]);

  const canEditDeleteStory = React.useMemo(() => {
    return isAuthenticated && storyGetData?.owner === user?.sub;
  }, [user, isAuthenticated, storyGetData]);

  const showStoryHeader = view === "edit" ? canEditDeleteStory : true;
  return (
    <DndProvider backend={HTML5Backend}>
      {!storyError401 &&
        showStoryHeader &&
        (view === "edit" || view === undefined) && (
          <StorySubheaderToolbar
            autoSave={autoSave.isAutoSaveEnabled}
            setAutoSave={setAutoSave}
            onStorySave={onSave}
            setName={setStoryName}
            setHasStoryNameFocused={setHasStoryNameFocused}
            setHasStoryNameBlurred={setHasStoryNameBlurred}
            isSaveEnabled={isSaveEnabled}
            name={page !== "new" && !view ? storyGetData.name : storyName}
            framesArray={framesArray}
            headerDetails={headerDetails}
            setStopInitializeFramesWidth={setStopInitializeFramesWidth}
            isPreviewView={isPreviewView}
            plugins={plugins}
            updateFramesArray={updateFramesArray}
            undoStack={undoStack}
            setUndoStack={setUndoStack}
            redoStack={redoStack}
            setRedoStack={setRedoStack}
          />
        )}
      {view && !storyError401 && view === "edit" && canEditDeleteStory && (
        <StoryRightPanel
          open={rightPanelOpen}
          currentView={view}
          headerDetails={headerDetails}
          setHeaderDetails={setHeaderDetails}
          setOpen={setRightPanelOpen}
          showHeaderItem={!headerDetails.showHeader}
          framesArray={framesArray}
          storyName={storyName}
          onSave={onSave}
        />
      )}

      <Switch>
        <Route exact path="/story/new/initial">
          <div
            css={`
              height: 98px;
            `}
          />
          <StoryInitialView
            resetStory={resetStory}
            handleSetButtonActive={handleSetButtonActive}
          />
        </Route>
        <Route exact path="/story/new/ai-template">
          <AITemplate />
        </Route>
        <Route exact path="/story/:page/edit">
          <div
            css={`
              height: ${canEditDeleteStory && !storyError401 ? "50px" : "0px"};
            `}
          />
          <section
            id="story-edit-view-section"
            css={`
              height: ${canEditDeleteStory && !storyError401
                ? "calc(100vh - 50px)"
                : "100vh"};
              overflow-y: auto;
              overflow-x: hidden;
            `}
          >
            <StoryEditView
              rightPanelOpen={rightPanelOpen}
              handleRightPanelOpen={() => setRightPanelOpen(true)}
              autoSave={autoSave.isAutoSaveEnabled}
              storyType={storyType}
              setStoryName={setStoryName}
              storyName={storyName}
              framesArray={framesArray}
              headerDetails={headerDetails}
              updateFramesArray={updateFramesArray}
              setHeaderDetails={setHeaderDetails}
              stopInitializeFramesWidth={stopInitializeFramesWidth}
              setStopInitializeFramesWidth={setStopInitializeFramesWidth}
              view={view}
              hasStoryNameFocused={hasStoryNameFocused}
              setHasStoryNameFocused={setHasStoryNameFocused}
              setPluginsState={setPluginsState}
              setAutoSave={setAutoSave}
              isSaveEnabled={isSaveEnabled}
              onSave={onSave}
              redoStack={redoStack}
              setRedoStack={setRedoStack}
              undoStack={undoStack}
              setUndoStack={setUndoStack}
            />
          </section>
        </Route>
        <Route exact path="/story/:page">
          <div
            css={`
              height: ${storyError401 ? "0px" : "98px"};
            `}
          />
          <StoryPreviewView
            setIsPreviewView={setIsPreviewView}
            setAutoSave={setAutoSave}
          />
        </Route>

        <Route exact path="/story/:page/downloaded-view">
          <DownloadedView
            setIsPreviewView={setIsPreviewView}
            setAutoSave={setAutoSave}
          />
        </Route>
        <Route exact path="/story/new">
          <Redirect to="/story/new/initial" />
        </Route>
        <Route exact path="/story/:page/not-available">
          <NotAvailableOnMobile />
        </Route>
        <Route path="*">
          <NoMatchPage />
        </Route>
      </Switch>
    </DndProvider>
  );
}
