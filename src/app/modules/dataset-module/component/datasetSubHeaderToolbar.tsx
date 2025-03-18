/** third-party */
import {
  Container,
  IconButton,
  Popover,
  Snackbar,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ShareIcon from "@material-ui/icons/Share";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreIcon from "@material-ui/icons/MoreVert";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
/** Project */
import { LinkIcon } from "app/assets/icons/Link";
import { useStoreActions, useStoreState } from "app/state/store/hooks";
import { styles } from "app/modules/dataset-module/component/styles";
import DeleteDatasetDialog from "app/components/Dialogs/deleteDatasetDialog";
import { ISnackbarState } from "app/modules/dataset-module/routes/upload-module/upload-steps/previewFragment";
import { InfoSnackbar } from "app/modules/story-module/components/storySubHeaderToolbar/infosnackbar";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import { useRecoilState, useSetRecoilState } from "recoil";
import { planDialogAtom, shareAssetDetailsAtom } from "app/state/recoil/atoms";
import ShareModal from "./shareModal";
import DuplicateMessage from "app/modules/common/mobile-duplicate-message";
import { PrimaryButton } from "app/components/Styled/button";
import { ArrowBack } from "@material-ui/icons";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export default function DatasetSubHeaderToolbar(
  props: Readonly<{ name: string }>
) {
  const { user, isAuthenticated } = useAuth0();
  const history = useHistory();
  const location = useLocation();
  const [_assetIdToShare, setAssetIdToShare] = useRecoilState(
    shareAssetDetailsAtom
  );
  const isSmallScreen = useMediaQuery("(max-width:743px)"); //at this breakpoint, we limit user creation abilities
  const { page } = useParams<{ page: string }>();
  const token = useStoreState((state) => state.AuthToken.value);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const fromHome = location.search.includes("fromHome=true");
  const [isShareModalOpen, setIsShareModalOpen] =
    React.useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [enableButton, setEnableButton] = React.useState<boolean>(false);
  const [modalDisplay, setModalDisplay] = React.useState<boolean>(false);
  const [duplicatedDatasetId, setDuplicatedDatasetId] = React.useState<
    string | null
  >(null);
  const [snackbarState, setSnackbarState] = React.useState<ISnackbarState>({
    open: false,
    vertical: "bottom",
    horizontal: "center",
    message: "Your dataset has been successfully duplicated!",
  });
  const setPlanDialog = useSetRecoilState(planDialogAtom);

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;
  const [displayMobileMenu, setDisplayMobileMenu] = React.useState(false);
  const loadDataset = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );
  const shareURL = `${window.location.origin}/dataset/${datasetDetails.id}`;
  const loadDatasets = useStoreActions(
    (actions) => actions.dataThemes.DatasetGetList.fetch
  );
  const canDatasetEditDelete = React.useMemo(() => {
    return isAuthenticated && datasetDetails?.owner === user?.sub;
  }, [user, isAuthenticated, datasetDetails]);

  React.useEffect(() => {
    if (token) {
      loadDataset({
        token,
        getId: page as string,
      });
    } else {
      loadDataset({
        token,
        getId: page as string,
        nonAuthCall: !token,
      });
    }
  }, [token, page]);

  const handleEditMobile = () => {
    setAssetIdToShare({
      assetURL: `/dataset/${page}/edit`,
      title: props.name,
    });
  };

  const handleBackToDataset = () => {
    setSnackbarState({ ...snackbarState, open: false });
    history.push(`/dataset/${duplicatedDatasetId}`);
    setDuplicatedDatasetId(null);
  };

  const handleDuplicate = () => {
    axios
      .get(`${process.env.REACT_APP_API}/dataset/duplicate/${page}`, {
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
        setDuplicatedDatasetId(response.data?.data?.id);
        setSnackbarState({
          ...snackbarState,
          open: true,
        });
      })
      .catch((error) => console.log(error));
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSharePopup = () => {
    setAnchorEl(null);
  };

  const handleSharePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isSmallScreen) {
      setIsShareModalOpen(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCopy = (text: string, result: boolean) => {
    setOpenSnackbar(result);
  };

  const handleModal = () => {
    setModalDisplay(true);
  };

  function handleDelete() {
    axios
      .delete(`${process.env.REACT_APP_API}/datasets/${page}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async () => {
        loadDatasets({
          token,
          storeInCrudData: true,
          filterString: "filter[order]=updatedDate desc",
        });
      })
      .catch((error) => console.log(error))
      .finally(() => {
        history.replace("/");
      });
  }

  const handleCloseSnackbarState = () => {
    setSnackbarState((prev) => ({ ...prev, open: false }));
  };

  return (
    <div id="subheader-toolbar" css={styles.container}>
      <Snackbar
        anchorOrigin={{
          vertical: isSmallScreen ? "top" : "bottom",
          horizontal: "left",
        }}
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />
      <DeleteDatasetDialog
        cardId={page}
        enableButton={enableButton}
        handleDelete={handleDelete}
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
        setEnableButton={setEnableButton}
      />
      {isSmallScreen ? (
        <InfoSnackbar
          anchorOrigin={{
            vertical: snackbarState.vertical,
            horizontal: snackbarState.horizontal,
          }}
          open={snackbarState.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbarState}
          key={snackbarState.vertical + snackbarState.horizontal}
        >
          <DuplicateMessage
            action={handleBackToDataset}
            closeSnackbar={handleCloseSnackbarState}
            name={datasetDetails.name}
            type="data"
          />
        </InfoSnackbar>
      ) : (
        <InfoSnackbar
          anchorOrigin={{
            vertical: snackbarState.vertical,
            horizontal: snackbarState.horizontal,
          }}
          open={snackbarState.open}
          onClose={handleCloseSnackbarState}
          message={snackbarState.message}
          key={snackbarState.vertical + snackbarState.horizontal}
          action={
            <PrimaryButton
              size="big"
              bg="dark"
              style={{ textTransform: "none" }}
              onClick={handleBackToDataset}
            >
              Go to Copied Dataset
            </PrimaryButton>
          }
        />
      )}
      <ShareModal
        datasetDetails={datasetDetails}
        isShareModalOpen={isShareModalOpen}
        setIsShareModalOpen={setIsShareModalOpen}
        handleCopy={handleCopy}
        url={shareURL}
      />

      <Container maxWidth="lg">
        <div css={styles.innercontainer}>
          <Link
            to={fromHome ? "/" : "/dashboard"}
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
            `}
            data-cy="dataset-back-to-library-btn"
          >
            <Tooltip title="Back to Dashboard">
              {isSmallScreen ? (
                <ArrowBackIosIcon fontSize="small" />
              ) : (
                <ArrowBack fontSize={"small"} />
              )}
            </Tooltip>
          </Link>

          <p
            title={props.name}
            css={`
              ${styles.nameInput}
              display: block;
              max-width: 1000px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            `}
          >
            {props.name}
          </p>

          <div css={styles.endContainer}>
            <div css={styles.iconbtns}>
              {!isSmallScreen && (
                <React.Fragment>
                  {isAuthenticated && (
                    <Tooltip title="Duplicate">
                      <IconButton onClick={handleDuplicate}>
                        <FileCopyIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Share">
                    <IconButton onClick={handleSharePopup}>
                      <ShareIcon htmlColor="#262c34" />
                    </IconButton>
                  </Tooltip>
                  <Popover
                    id={popoverId}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleCloseSharePopup}
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
                  >
                    <div css={styles.sharePopup}>
                      <CopyToClipboard
                        text={window.location.href}
                        onCopy={handleCopy}
                      >
                        <Button startIcon={<LinkIcon />}>Copy link</Button>
                      </CopyToClipboard>
                    </div>
                  </Popover>
                  {canDatasetEditDelete && (
                    <Tooltip title="Edit">
                      <IconButton component={Link} to={`/dataset/${page}/edit`}>
                        <EditIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {canDatasetEditDelete && (
                    <Tooltip title="Delete">
                      <IconButton onClick={handleModal}>
                        <DeleteIcon htmlColor="#262c34" />
                      </IconButton>
                    </Tooltip>
                  )}
                </React.Fragment>
              )}
              {isSmallScreen && (
                <React.Fragment>
                  <IconButton
                    aria-describedby={"more-button-mobile"}
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
                    {canDatasetEditDelete && (
                      <Tooltip title="Edit">
                        <IconButton
                          component={Link}
                          aria-label="edit-button"
                          to={`/dataset/${page}/not-available`}
                          onClick={handleEditMobile}
                          css={`
                            @media (max-width: 743px) {
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

                    {isAuthenticated && (
                      <Tooltip title="Duplicate">
                        <IconButton onClick={handleDuplicate}>
                          <FileCopyIcon htmlColor="#262c34" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Share">
                      <IconButton onClick={handleSharePopup}>
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
    </div>
  );
}
