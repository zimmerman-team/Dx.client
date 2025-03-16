import React from "react";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import Popover from "@material-ui/core/Popover";
import ShareIcon from "@material-ui/icons/Share";
import MoreIcon from "@material-ui/icons/MoreVert";
import { LinkIcon } from "app/assets/icons/Link";
import DeleteIcon from "@material-ui/icons/Delete";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import CloudDoneIcon from "@material-ui/icons/CloudDone";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import CopyToClipboard from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { PageLoader } from "app/modules/common/page-loader";
import { Link, useHistory, useParams } from "react-router-dom";
import Snackbar from "@material-ui/core/Snackbar";
import { styles } from "app/modules/chart-module/components/chartSubheaderToolbar/styles";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import DeleteChartDialog from "app/components/Dialogs/deleteChartDialog";
import { ChartAPIModel, emptyChartAPI } from "app/modules/chart-module/data";
import { ChartSubheaderToolbarProps } from "app/modules/chart-module/components/chartSubheaderToolbar/data";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";
import {
  chartFromStoryAtom,
  planDialogAtom,
  shareAssetDetailsAtom,
} from "app/state/recoil/atoms";
import AutoSaveSwitch from "app/modules/story-module/components/storySubHeaderToolbar/autoSaveSwitch";
import useAutosave from "app/hooks/useAutoSave";
import { useStyles } from "app/modules/story-module/components/storySubHeaderToolbar";
import AutoResizeInput from "app/modules/story-module/components/storySubHeaderToolbar/autoResizeInput";
import { isEqual } from "lodash";
import EmbedChartDialog from "app/components/Dialogs/EmbedChartDialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import DuplicateMessage from "app/modules/common/mobile-duplicate-message";
import { InfoSnackbar } from "app/modules/story-module/components/storySubHeaderToolbar/infosnackbar";
import ShareModal from "app/modules/dataset-module/component/shareModal";
import { PrimaryButton } from "app/components/Styled/button";
import { ArrowBack } from "@material-ui/icons";

// eslint-disable-next-line sonarjs/cognitive-complexity
export function ChartSubheaderToolbar(
  props: Readonly<ChartSubheaderToolbarProps>
) {
  const classes = useStyles();
  const history = useHistory();
  const isMobile = useMediaQuery("(max-width: 599px)");
  const isSmallScreen = useMediaQuery("(max-width:788px)"); //at this breakpoint, we limit user creation abilities
  const { user, isAuthenticated } = useAuth0();
  const token = useStoreState((state) => state.AuthToken.value);
  const titleRef = React.useRef<HTMLDivElement>(null);
  const innerContainerRef = React.useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] =
    React.useState<boolean>(false);
  const { page, view } = useParams<{ page: string; view?: string }>();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [displayEmbedModal, setDisplayEmbedModal] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [hasChangesBeenMade, setHasChangesBeenMade] = React.useState(false);

  const [inputSpanVisibiltiy, setInputSpanVisibility] = React.useState(true);
  const [duplicatedChartId, setDuplicatedChartId] = React.useState<
    string | null
  >(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [displayMobileMenu, setDisplayMobileMenu] = React.useState(false);
  React.useState<HTMLButtonElement | null>(null);
  const [chartFromStory, setChartFromStory] =
    useRecoilState(chartFromStoryAtom);
  const [assetIdToShare, setAssetIdToShare] = useRecoilState(
    shareAssetDetailsAtom
  );
  const mapping = useStoreState((state) => state.charts.mapping.value);

  const dataset = useStoreState((state) => state.charts.dataset.value);
  const appliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const selectedChartType = useStoreState(
    (state) => state.charts.chartType.value
  );

  const loadCharts = useStoreActions(
    (actions) => actions.charts.ChartGetList.fetch
  );
  const loadedChart = useStoreState(
    (state) =>
      (state.charts.ChartGet.crudData ?? emptyChartAPI) as ChartAPIModel
  );
  const shareURL = `${window.location.origin}/chart/${loadedChart.id}`;

  const editChartCrudData = useStoreState(
    (state) => state.charts.ChartUpdate.crudData
  ) as ChartAPIModel;

  const createChartLoading = useStoreState(
    (state) => state.charts.ChartCreate.loading
  );
  const editChartLoading = useStoreState(
    (state) => state.charts.ChartUpdate.loading
  );
  const canChartEditDelete = React.useMemo(() => {
    return isAuthenticated && loadedChart && loadedChart.owner === user?.sub;
  }, [user, isAuthenticated, loadedChart]);

  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const isMappingValid = React.useMemo(() => {
    return loadedChart?.isMappingValid || editChartCrudData?.isMappingValid;
  }, [loadedChart, editChartCrudData]);

  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
    message: "Your chart has been successfully duplicated!",
  });

  React.useEffect(() => {
    setHasChangesBeenMade(compareStateChanges);
  }, [
    props.name,
    selectedChartType,
    mapping,
    dataset,
    props.visualOptions,
    appliedFilters,
  ]);

  useAutosave(
    () => {
      props.onSave();
    },
    2 * 1000,
    props.autoSave && canChartEditDelete,
    hasChangesBeenMade,
    [
      props.name,
      props.isAiSwitchActive,
      selectedChartType,
      mapping,
      dataset,
      props.visualOptions,
      appliedFilters,
    ]
  );

  const isPreviewDisabled: boolean = React.useMemo(() => {
    return isEmpty(selectedChartType) || !isMappingValid || view === "preview";
  }, [selectedChartType, mapping, view, editChartCrudData]);

  const handleDeleteModalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.value === "DELETE") {
      setEnableButton(true);
    } else {
      setEnableButton(false);
    }
  };

  const handleShare = () => {
    if (isMobile) {
      setIsShareModalOpen(true);
    } else {
      setDisplayEmbedModal(true);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = (text: string, result: boolean) => {
    setOpenSnackbar(result);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleEdit = () => {
    props.setAutoSaveState({
      isAutoSaveEnabled: true,
      enableAutoSaveSwitch: true,
    });

    if (!props.isMappingValid) {
      history.push(`/chart/${page}/mapping`);
    } else {
      history.push(`/chart/${page}/customize`);
    }
  };
  const compareStateChanges = () => {
    if (loadedChart.id !== page) return false;
    return (
      !isEqual(props.name, loadedChart.name) ||
      !isEqual(selectedChartType, loadedChart.vizType) ||
      !isEqual(mapping, loadedChart.mapping) ||
      !isEqual(dataset as string, loadedChart.datasetId as string) ||
      !isEqual(props.visualOptions, loadedChart.vizOptions) ||
      !isEqual(appliedFilters, loadedChart.appliedFilters)
    );
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleModalDisplay = () => {
    setShowDeleteDialog(true);
  };

  const handleDelete = () => {
    setEnableButton(false);

    setShowDeleteDialog(false);
    axios
      .delete(`${process.env.REACT_APP_API}/chart/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async () => {
        loadCharts({
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
      .get(`${process.env.REACT_APP_API}/chart/duplicate/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        loadCharts({
          token,
          storeInCrudData: true,
          filterString: "filter[order]=updatedDate desc",
        });
        setDuplicatedChartId(response.data?.data?.id);
        setSnackbarState({
          ...snackbarState,
          open: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handlePreviewMode = () => {
    props.onSave();
    history.push(`/chart/${page}`);
  };
  const handleViewDuplicatedChart = () => {
    setSnackbarState({ ...snackbarState, open: false });

    history.push(`/chart/${duplicatedChartId}`);
    setDuplicatedChartId(null);
  };
  const handleBackToEdit = () => {
    history.go(-1);
  };
  const handleBackToStory = () => {
    const { page: storyPage, view: storyView } = chartFromStory;
    setChartFromStory((prev) => ({ ...prev, chartId: page }));
    props.onSave();
    history.push(`/story/${storyPage}/edit`);
  };

  return (
    <div id="subheader-toolbar" css={styles.container}>
      {createChartLoading && <PageLoader />}
      <Container maxWidth="lg">
        <div css={styles.innercontainer} ref={innerContainerRef}>
          <div
            css={`
              display: flex;
              align-items: center;
              position: relative;
              width: 100%;
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
                position: absolute;
                left: -32px;
                cursor: pointer;
                @media (max-width: 960px) {
                  position: static;
                  margin-right: 8px;
                }
                @media (max-width: 450px) {
                  position: static;
                }
              `}
              data-cy="dataset-back-to-library-btn"
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
                gap: 12px;

                width: 72%;
                position: relative;
                @media (min-width: 768px) {
                  @media (max-width: 828px) {
                    width: ${canChartEditDelete ? "50%" : "90%"};
                  }
                }
                @media (min-width: 829px) {
                  @media (max-width: 1040px) {
                    width: 55%;
                  }
                }
                @media (min-width: 1041px) {
                  @media (max-width: 1373px) {
                    width: 64%;
                  }
                }
              `}
            >
              <AutoResizeInput
                name={props.name}
                setName={props.setName}
                placeholder="Title"
                autoResize={false}
                maxWidth={titleRef.current?.offsetWidth ?? 1000}
                spanBuffer={0}
                minWidth={100}
                spanVisibility={inputSpanVisibiltiy}
                setSpanVisibility={setInputSpanVisibility}
                onClick={(e) => {
                  if (props.name === "Untitled Chart") {
                    e.currentTarget.value = "";
                  }
                }}
                onBlur={() => {
                  props.setHasSubHeaderTitleBlurred?.(true);
                  setInputSpanVisibility(true);
                }}
                onFocus={() => {
                  props.setHasSubHeaderTitleFocused?.(true);
                  props.setHasSubHeaderTitleBlurred?.(false);
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

          <div css={styles.endContainer}>
            {editChartLoading && canChartEditDelete && (
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
                  `}
                >
                  saving changes{" "}
                </p>
              </div>
            )}
            {props.savedChanges && canChartEditDelete && (
              <div
                css={`
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  flex-shrink: 0;
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
                  `}
                >
                  All changes saved{" "}
                </p>
              </div>
            )}
            {chartFromStory.state && (
              <button
                onClick={handleBackToStory}
                css={styles.backToStory}
                type="button"
                data-testid="back-to-story-button"
                data-cy="back-to-story-button"
              >
                Back to the story
              </button>
            )}
            {view === "preview" && (
              <button
                onClick={handleBackToEdit}
                css={styles.backToEdit}
                type="button"
                data-testid="back-to-edit-button"
              >
                <EditIcon htmlColor="#fff" />
                Go back to editing
              </button>
            )}

            <div css={styles.iconbtns}>
              {(page === "new" || view) && canChartEditDelete && (
                <React.Fragment>
                  <div
                    css={`
                      display: flex;
                      gap: 14px;
                      align-items: center;
                      margin-right: 17px;
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
                      disabled={!props.enableAutoSaveSwitch}
                      checked={props.autoSave}
                      setAutoSave={
                        props.setAutoSaveState as React.Dispatch<
                          React.SetStateAction<{
                            isAutoSaveEnabled: boolean;
                            showAutoSaveSwitch?: boolean;
                          }>
                        >
                      }
                    />
                  </div>

                  <Tooltip title="Preview">
                    <span>
                      <IconButton
                        onClick={handlePreviewMode}
                        aria-label="preview-button"
                        // disabled={isPreviewDisabled}
                        data-testid="preview-button"
                        css={`
                          :disabled {
                            opacity: 0.5;
                          }
                        `}
                      >
                        <svg width="20" height="19" viewBox="0 0 20 19">
                          <rect width="20" height="19" rx="3" fill="#262C34" />
                          <path
                            fill="#EFEFEF"
                            d="M14 9L6.5 13.3301L6.5 4.66987L14 9Z"
                          />
                        </svg>
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Save">
                    <span>
                      <IconButton
                        onClick={props.onSave}
                        aria-label="save-button"
                      >
                        <SaveIcon htmlColor="#262c34" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </React.Fragment>
              )}
              {page !== "new" && !view && !isSmallScreen && (
                <React.Fragment>
                  {/* <ExportChartButton filename={props.name} /> */}
                  {isAuthenticated && (
                    <Tooltip title="Duplicate">
                      <IconButton
                        onClick={handleDuplicate}
                        aria-label="duplicate-button"
                      >
                        <FileCopyIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Share">
                    <IconButton onClick={handleShare} aria-label="share-button">
                      <ShareIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>

                  {canChartEditDelete && (
                    <Tooltip title="Edit">
                      <IconButton onClick={handleEdit} aria-label="edit-button">
                        <EditIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canChartEditDelete && (
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={handleModalDisplay}
                        aria-label="delete-button"
                      >
                        <DeleteIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                </React.Fragment>
              )}
              {isSmallScreen && (
                <React.Fragment>
                  <IconButton
                    aria-describedby={id}
                    onClick={() => setDisplayMobileMenu(!displayMobileMenu)}
                    aria-label="more"
                    data-testid="more-button"
                  >
                    <MoreIcon htmlColor="#262c34" />
                  </IconButton>
                  <div
                    css={`
                      position: absolute;
                      top: 115%;
                      right: -4px;
                      opacity: ${displayMobileMenu ? 1 : 0};
                      box-shadow: 0px 0px 10px 0px #98a1aa99;
                      transition: opacity 211ms cubic-bezier(0.4, 0, 0.2, 1),
                        transform 141ms cubic-bezier(0.4, 0, 0.2, 1);
                      border-radius: 4px;
                      background: var(--Secondary-Background-grey, #f4f4f4);
                      display: flex;
                      height: 56px;
                      padding: 16px;
                      align-items: center;
                      gap: 16px;
                      flex-shrink: 0;
                    `}
                  >
                    {canChartEditDelete && (
                      <Tooltip title="Edit">
                        <Link
                          aria-label="edit-button"
                          to={`/not-available`}
                          onClick={() => {
                            setAssetIdToShare({
                              assetURL: `/chart/${page}/customize`,
                              title: props.name,
                            });
                          }}
                        >
                          <EditIcon htmlColor="#262c34" />
                        </Link>
                      </Tooltip>
                    )}

                    {isAuthenticated && (
                      <Tooltip title="Duplicate">
                        <IconButton
                          onClick={handleDuplicate}
                          aria-label="duplicate-button"
                        >
                          <FileCopyIcon htmlColor="#262c34" />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Share">
                      <IconButton
                        onClick={handleShare}
                        aria-label="share-button"
                      >
                        <ShareIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
      </Container>

      <>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          css={`
            .MuiPaper-root {
              border-radius: 10px;
              background: #495057;
            }
          `}
          aria-label="copy-link-popover"
        >
          <div css={styles.sharePopup} data-testid="copy-link-action">
            <CopyToClipboard text={window.location.href} onCopy={handleCopy}>
              <Button startIcon={<LinkIcon />}>Copy link</Button>
            </CopyToClipboard>
          </div>
        </Popover>
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
              action={handleViewDuplicatedChart}
              closeSnackbar={() =>
                setSnackbarState({ ...snackbarState, open: false })
              }
              name={loadedChart.name}
              type="chart"
            />
          </InfoSnackbar>
        ) : (
          <InfoSnackbar
            anchorOrigin={{
              vertical: snackbarState.vertical,
              horizontal: snackbarState.horizontal,
            }}
            data-testid="duplicated-chart-snackbar"
            open={snackbarState.open}
            onClose={() => setSnackbarState({ ...snackbarState, open: false })}
            message={snackbarState.message}
            key={snackbarState.vertical + snackbarState.horizontal}
            action={
              <PrimaryButton
                size="big"
                bg="dark"
                style={{ textTransform: "none" }}
                onClick={handleViewDuplicatedChart}
              >
                Go to Copied Chart
              </PrimaryButton>
            }
          />
        )}
      </>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
        data-testid="copied-link-snackbar"
      />
      <ShareModal
        datasetDetails={loadedChart}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        handleCopy={handleCopy}
        url={shareURL}
      />
      <DeleteChartDialog
        modalDisplay={showDeleteDialog}
        enableButton={enableButton}
        handleDelete={handleDelete}
        setModalDisplay={setShowDeleteDialog}
        handleInputChange={handleDeleteModalInputChange}
      />
      {displayEmbedModal && (
        <EmbedChartDialog
          modalDisplay={displayEmbedModal}
          setModalDisplay={setDisplayEmbedModal}
          chartId={page}
          chartName={props.name}
          datasetId={loadedChart.datasetId!}
        />
      )}
    </div>
  );
}
