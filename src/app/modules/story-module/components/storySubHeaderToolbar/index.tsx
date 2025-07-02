import React from "react";
import axios from "axios";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";

import ShareIcon from "@material-ui/icons/Share";

import Snackbar from "@material-ui/core/Snackbar";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import IconButton from "@material-ui/core/IconButton";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import { planDialogAtom, shareAssetDetailsAtom } from "app/state/recoil/atoms";
import { PageLoader } from "app/modules/common/page-loader";
import MoreIcon from "@material-ui/icons/MoreVert";
import {
  ClickAwayListener,
  createStyles,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { Link, useHistory, useParams } from "react-router-dom";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { StoryModel, emptyStory } from "app/modules/story-module/data";
import DeleteStoryDialog from "app/components/Dialogs/deleteStoryDialog";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { StorySubheaderToolbarProps } from "app/modules/chart-module/components/chartSubheaderToolbar/data";
import { styles } from "app/modules/story-module/components/storySubHeaderToolbar/styles";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";
import StaticToolbar from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";
import AutoSaveSwitch from "app/modules/story-module/components/storySubHeaderToolbar/autoSaveSwitch";
import AutoResizeInput from "app/modules/story-module/components/storySubHeaderToolbar/autoResizeInput";
import { InfoSnackbar } from "app/modules/story-module/components/storySubHeaderToolbar/infosnackbar";
import ShareModal from "app/modules/dataset-module/component/shareModal";
import DuplicateMessage from "app/modules/common/mobile-duplicate-message";
import { ExportStoryButton } from "./exportButton";
import { PrimaryButton } from "app/components/Styled/button";
import { ArrowBack } from "@material-ui/icons";
import { MOBILE_BREAKPOINT, TABLET_STARTPOINT } from "app/theme";
import ShareComponent from "app/components/ShareComponent";

export const useStyles = makeStyles(() =>
  createStyles({
    rotateIcon: {
      animation: "$spin 2s linear infinite",
    },
    "@keyframes spin": {
      "0%": {
        transform: "rotate(360deg)",
      },
      "100%": {
        transform: "rotate(0deg)",
      },
    },
  })
);

// eslint-disable-next-line sonarjs/cognitive-complexity
export function StorySubheaderToolbar(
  props: Readonly<StorySubheaderToolbarProps>
) {
  const history = useHistory();
  const classes = useStyles();
  const { user, isAuthenticated } = useAuth0();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`); //at this breakpoint, we limit user creation abilities
  const titleRef = React.useRef<HTMLDivElement>(null);
  const { page, view } = useParams<{ page: string; view?: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [inputSpanVisibiltiy, setInputSpanVisibility] = React.useState(true);

  const [duplicatedStoryId, setDuplicatedStoryId] = React.useState<
    string | null
  >(null);

  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
    message: "Your story has been successfully duplicated!",
  });

  const [savedChanges, setSavedChanges] = React.useState<boolean>(false);

  const loadStories = useStoreActions(
    (actions) => actions.stories.StoryGetList.fetch
  );
  const loadedStory = useStoreState(
    (state) => (state.stories.StoryGet.crudData ?? emptyStory) as StoryModel
  );

  const loadedStoryTempData = useStoreState(
    (state) => (state.stories.StoryGet.tempData ?? emptyStory) as StoryModel
  );
  const shareURL = `${window.location.origin}/story/${loadedStory.id}`;

  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );

  const createOrEditChartLoading = useStoreState(
    (state) =>
      state.charts.ChartCreate.loading || state.charts.ChartUpdate.loading
  );

  const createChartClear = useStoreActions(
    (actions) => actions.charts.ChartCreate.clear
  );
  const editChartClear = useStoreActions(
    (actions) => actions.charts.ChartUpdate.clear
  );

  const storyEditSuccess = useStoreState(
    (state) => state.stories.StoryUpdate.success
  );
  const storyEditLoading = useStoreState(
    (state) => state.stories.StoryUpdate.loading
  );
  const [_assetIdToShare, setAssetIdToShare] = useRecoilState(
    shareAssetDetailsAtom
  );
  const [displayMobileMenu, setDisplayMobileMenu] = React.useState(false);

  React.useEffect(() => {
    // handles saved changes state for autosave
    let timeout: NodeJS.Timeout;
    if (storyEditSuccess) {
      setSavedChanges(true);
      timeout = setTimeout(() => {
        setSavedChanges(false);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [storyEditSuccess]);

  const handleEditMobile = () => {
    setAssetIdToShare({
      assetURL: `/chart/${page}/customize`,
      title: props.name,
    });
  };
  const handleDeleteModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const onSave = () => {
    props.onStorySave("edit");
  };

  const handleViewStory = () => {
    props.onStorySave("edit").then(() => {
      history.push(`/story/${page}`);
    });
  };

  React.useEffect(() => {
    return () => {
      createChartClear();
      editChartClear();
    };
  }, []);

  const handleModalDisplay = () => {
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    setEnableButton(false);
    setShowDeleteDialog(false);

    axios
      .delete(`${process.env.REACT_APP_API}/story/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async () => {
        loadStories({
          token,
          storeInCrudData: true,
          filterString: "filter[order]=updatedDate desc",
        });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        history.replace("/");
      });
  };

  const handleDuplicate = () => {
    axios
      .get(`${process.env.REACT_APP_API}/story/duplicate/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        loadStories({
          token,
          storeInCrudData: true,
          filterString: "filter[order]=updatedDate desc",
        });
        setDuplicatedStoryId(response.data?.data?.id);
        setSnackbarState({
          ...snackbarState,
          open: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleViewDuplicatedStory = () => {
    setSnackbarState({ ...snackbarState, open: false });
    history.push(`/story/${duplicatedStoryId}`);
    setDuplicatedStoryId(null);
  };

  const canStoryEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedStory && loadedStory.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart, loadedStory]);

  const handleSignIn = () => {
    localStorage.setItem("duplicateStoryAfterSignIn", page);
    history.push("/onboarding/signin");
  };

  return (
    <div id="subheader-toolbar" css={styles.container(view !== undefined)}>
      {createOrEditChartLoading && <PageLoader />}

      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <div
            css={`
              display: flex;
              align-items: center;
              position: relative;
              width: 100%;
              gap: 8px;
            `}
          >
            <Link
              to={"/"}
              css={`
                display: flex;
                align-items: center;
                font-size: 14px;
                color: #231d2c;
                text-decoration: none;
                cursor: pointer;
              `}
              data-cy="story-back-to-library-btn"
            >
              <Tooltip title="Back to Dashboard">
                {isMobile ? (
                  <ArrowBackIosIcon fontSize="small" />
                ) : (
                  <ArrowBack fontSize={"small"} />
                )}
              </Tooltip>
            </Link>
            <div
              ref={titleRef}
              css={`
                display: flex;
                align-items: center;
                gap: 28px;
                position: relative;
                width: 70%;
                @media (min-width: ${TABLET_STARTPOINT}) {
                  @media (max-width: 1199px) {
                    width: 100%;
                  }
                }
              `}
            >
              <AutoResizeInput
                name={props.name}
                setName={props.setName}
                placeholder="Title"
                autoResize={true}
                maxWidth={(titleRef.current?.offsetWidth ?? 1000) - 100}
                spanBuffer={isMobile ? 0 : 150}
                minWidth={200}
                spanVisibility={inputSpanVisibiltiy}
                setSpanVisibility={setInputSpanVisibility}
                onClick={(e) => {
                  if (props.name === "Untitled story") {
                    e.currentTarget.value = "";
                  }
                }}
                onBlur={() => {
                  setInputSpanVisibility(true);
                  props.setHasStoryNameBlurred?.(true);
                }}
                onFocus={() => {
                  props.setHasStoryNameFocused?.(true);
                  props.setHasStoryNameBlurred?.(false);
                  setInputSpanVisibility(false);
                }}
                disabled={props.isPreviewView}
                style={
                  page !== "new" && !view
                    ? {
                        pointerEvents: "none",
                      }
                    : {}
                }
              />
            </div>
          </div>
          {view !== "initial" && (
            <>
              {(page === "new" || view) && (
                <div css={styles.endContainer}>
                  {storyEditLoading && (
                    <div
                      css={`
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        span {
                          margin-bottom: -4px;
                        }
                      `}
                    >
                      <span>
                        <AutorenewIcon
                          htmlColor="#70777E"
                          className={classes.rotateIcon}
                        />
                      </span>
                      <p
                        css={`
                          color: #70777e;
                          font-family: "GothamNarrow-Book", "Helvetica Neue",
                            sans-serif;
                          font-size: 12px;
                          font-weight: 325;
                          margin: 0px;
                          white-space: nowrap;
                        `}
                      >
                        saving changes{" "}
                      </p>
                    </div>
                  )}
                  {savedChanges && (
                    <div
                      css={`
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        span {
                          margin-bottom: -7px;
                        }
                      `}
                    >
                      <span>
                        <CloudDoneIcon htmlColor="#70777E" />
                      </span>
                      <p
                        css={`
                          color: #70777e;
                          font-family: "GothamNarrow-Book", "Helvetica Neue",
                            sans-serif;
                          font-size: 12px;
                          font-weight: 325;
                          margin: 0px;
                          margin-top: 2px;
                          white-space: nowrap;
                        `}
                      >
                        All changes saved{" "}
                      </p>
                    </div>
                  )}
                  <div
                    css={`
                      display: flex;
                      gap: 14px;
                      align-items: center;
                    `}
                  >
                    <span
                      css={`
                        color: #000;

                        font-family: "GothamNarrow-Book", "Helvetica Neue",
                          sans-serif;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 325;
                        margin-right: 10px;
                      `}
                    >
                      AutoSave
                    </span>
                    <AutoSaveSwitch
                      checked={props.autoSave}
                      setAutoSave={props.setAutoSave}
                    />
                  </div>
                  {view === "edit" && (
                    <Tooltip title="view story">
                      <IconButton
                        onClick={handleViewStory}
                        css={`
                          padding: 0px;
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                        data-cy="view-story-button-tablet"
                        aria-label="view-story-button-tablet"
                      >
                        <svg width="20" height="19" viewBox="0 0 20 19">
                          <rect width="20" height="19" rx="3" fill="#262C34" />
                          <path
                            fill="#EFEFEF"
                            d="M14 9L6.5 13.3301L6.5 4.66987L14 9Z"
                          />
                        </svg>
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Save">
                    <span>
                      <IconButton
                        onClick={onSave}
                        disabled={!props.isSaveEnabled}
                        aria-label="save button"
                        css={`
                          padding: 0px;
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                        data-cy="save-story-button"
                      >
                        <SaveIcon htmlColor="#262c34" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </div>
              )}
              {page !== "new" && !view && (
                <div css={styles.previewEndContainer}>
                  {!isMobile && (
                    <React.Fragment>
                      <ExportStoryButton filename={props.name} />
                      <Tooltip title="Duplicate">
                        <IconButton
                          onClick={
                            isAuthenticated ? handleDuplicate : handleSignIn
                          }
                          data-testid="duplicate-button"
                        >
                          <FileCopyIcon htmlColor="#262c34" />
                        </IconButton>
                      </Tooltip>

                      <ShareComponent
                        shareURL={shareURL}
                        itemName={loadedStory?.name}
                        isPublic={loadedStoryTempData?.public}
                        setIsPublic={props.onSetIsPublic}
                      />

                      {canStoryEditDelete && (
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            to={`/story/${page}/edit`}
                            data-testid="edit-button"
                          >
                            <EditIcon htmlColor="#262c34" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {canStoryEditDelete && (
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={handleModalDisplay}
                            data-testid="delete-button"
                          >
                            <DeleteIcon htmlColor="#262c34" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </React.Fragment>
                  )}
                  {isMobile && (
                    <ClickAwayListener
                      onClickAway={() => setDisplayMobileMenu(false)}
                    >
                      <div>
                        <IconButton
                          aria-describedby={"more-button"}
                          onClick={() =>
                            setDisplayMobileMenu(!displayMobileMenu)
                          }
                          aria-label="more"
                          data-testid="more-button"
                        >
                          <MoreIcon htmlColor="#262c34" />
                        </IconButton>
                        <div
                          css={`
                            position: absolute;
                            top: 100%;
                            right: -4px;
                            opacity: ${displayMobileMenu ? 1 : 0};
                            box-shadow: 0px 0px 10px 0px #98a1aa99;
                            transition: opacity 211ms
                                cubic-bezier(0.4, 0, 0.2, 1),
                              transform 141ms cubic-bezier(0.4, 0, 0.2, 1);
                            border-radius: 4px;
                            background: #f4f4f4;
                            display: flex;
                            height: 56px;
                            padding: 16px;
                            align-items: center;
                            gap: 16px;
                            flex-shrink: 0;
                            a {
                              height: 100%;
                              padding: 0;
                            }
                          `}
                        >
                          {canStoryEditDelete && (
                            <Tooltip title="Edit">
                              <IconButton
                                component={Link}
                                to={`/story/${page}/not-available`}
                                onClick={handleEditMobile}
                                data-testid="edit-button"
                                css={`
                                  @media (max-width: ${MOBILE_BREAKPOINT}) {
                                    svg {
                                      path {
                                        fill: #70777e;
                                      }
                                    }
                                  }
                                `}
                              >
                                <EditIcon htmlColor="#262c34" />
                              </IconButton>
                            </Tooltip>
                          )}

                          <Tooltip title="Duplicate">
                            <IconButton
                              onClick={
                                isAuthenticated ? handleDuplicate : handleSignIn
                              }
                              data-testid="duplicate-button"
                            >
                              <FileCopyIcon htmlColor="#262c34" />
                            </IconButton>
                          </Tooltip>
                          <ShareComponent
                            shareURL={shareURL}
                            itemName={loadedStory?.name}
                            isPublic={loadedStoryTempData?.public}
                            setIsPublic={props.onSetIsPublic}
                          />
                        </div>
                      </div>
                    </ClickAwayListener>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
      {view === "edit" && (
        <Container maxWidth="lg">
          <StaticToolbar plugins={props.plugins} />
        </Container>
      )}
      <>
        {isMobile ? (
          <InfoSnackbar
            anchorOrigin={{
              vertical: snackbarState.vertical,
              horizontal: snackbarState.horizontal,
            }}
            open={snackbarState.open}
            autoHideDuration={6000}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            key={snackbarState.vertical + snackbarState.horizontal}
          >
            <DuplicateMessage
              action={handleViewDuplicatedStory}
              closeSnackbar={() =>
                setSnackbarState({ ...snackbarState, open: false })
              }
              name={loadedStory.name}
              type="story"
            />
          </InfoSnackbar>
        ) : (
          <InfoSnackbar
            anchorOrigin={{
              vertical: snackbarState.vertical,
              horizontal: snackbarState.horizontal,
            }}
            open={snackbarState.open}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            message={snackbarState.message}
            key={snackbarState.vertical + snackbarState.horizontal}
            action={
              <PrimaryButton
                size="big"
                bg="dark"
                style={{ textTransform: "none" }}
                onClick={handleViewDuplicatedStory}
              >
                Go to Copied Story
              </PrimaryButton>
            }
          />
        )}
      </>
      <DeleteStoryDialog
        modalDisplay={showDeleteDialog}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setShowDeleteDialog}
        handleInputChange={handleDeleteModalInputChange}
      />
    </div>
  );
}
