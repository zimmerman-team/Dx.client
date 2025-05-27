import React from "react";
import {
  IconButton,
  Popover,
  Tooltip,
  Snackbar,
  useMediaQuery,
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import ShareModal from "app/modules/dataset-module/component/shareModal";
import CopyToClipboard from "react-copy-to-clipboard";
import CloseIcon from "./assets/close-icon";
import ResetIcon from "./assets/reset-icon";
import { PrimaryButton } from "app/components/Styled/button";
import { CustomSwitch } from "./components/custom-switch";
import { MOBILE_BREAKPOINT } from "app/theme";

interface ShareComponentProps {
  shareURL: string;
  itemName?: string;
  isPublic?: boolean;
  setIsPublic?: (isPublic: boolean) => void;
}

const ShareComponent = ({
  itemName,
  shareURL,
  isPublic,
  setIsPublic,
}: ShareComponentProps) => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`); //at this breakpoint, we limit user creation abilities
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [copied, setCopied] = React.useState(false);
  const [isShareModalOpen, setIsShareModalOpen] =
    React.useState<boolean>(false);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleCopy = (text: string, result: boolean) => {
    setCopied(true);
  };
  const handleCloseSnackbar = () => {
    setCopied(false);
  };

  const handleSharePopup = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <React.Fragment>
      <Tooltip title="Share">
        <IconButton onClick={handleSharePopup} data-testid="share-button">
          <ShareIcon htmlColor="#262c34" />
        </IconButton>
      </Tooltip>
      {/* {isMobile ? (
        <ShareModal
          itemName={itemName}
          isShareModalOpen={isShareModalOpen}
          setIsShareModalOpen={setIsShareModalOpen}
          handleCopy={handleCopy}
          url={shareURL}
        />
      ) : ( */}
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
            background: #f1f3f5;
            box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
            width: 396px;
            padding: 0px 16px;

            @media (max-width: ${MOBILE_BREAKPOINT}) {
              width: 333px;
            }
          }
        `}
      >
        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0px;
            border-bottom: 1px solid #adb5bd;
          `}
        >
          <p
            css={`
              margin: 0;
              line-height: 20px; /* 142.857% */
              font-size: 14px;
              font-weight: 400;
              font-family: "GothamNarrow-Bold", sans-serif;
            `}
          >
            Share this Asset
          </p>
          <button
            css={`
              border: none;
              background: transparent;
              cursor: pointer;
              padding: 0;
            `}
            onClick={() => handleClose()}
          >
            <CloseIcon />
          </button>
        </div>

        <div
          css={`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 0px;
          `}
        >
          <p
            css={`
              margin: 0;
              font-size: 14px;
              line-height: 20px; /* 142.857% */
            `}
          >
            Anyone with the link can view.
          </p>
          <ResetIcon />
          <CopyToClipboard text={window.location.href} onCopy={handleCopy}>
            <PrimaryButton
              bg="light"
              size="small"
              onClick={() => handleCopy}
              css={`
                padding: 0px 12px;
                height: 28px;
                border-radius: 10px;
                border: 0.5px solid #adb5bd;
                flex-shrink: 0;
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  width: max-content;
                }
              `}
            >
              {copied ? "Link Copied!" : "Copy link"}
            </PrimaryButton>
          </CopyToClipboard>
          <CustomSwitch checked={isPublic} onChange={setIsPublic} />
        </div>
      </Popover>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={copied}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        message="Link copied to clipboard"
      />
    </React.Fragment>
  );
};

export default ShareComponent;
