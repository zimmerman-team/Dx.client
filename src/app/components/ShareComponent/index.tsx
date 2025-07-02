import React from "react";
import {
  IconButton,
  Popover,
  Tooltip,
  Snackbar,
  useMediaQuery,
} from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import CopyToClipboard from "react-copy-to-clipboard";
import CloseIcon from "./assets/close-icon";
import ResetIcon from "./assets/reset-icon";
import { PrimaryButton } from "app/components/Styled/button";
import { CustomSwitch } from "./components/custom-switch";
import { MOBILE_BREAKPOINT } from "app/theme";
import Tabs from "./components/tabs";
import CopyIcon from "./assets/copy-icon";

interface ShareComponentProps {
  shareURL: string;
  itemName?: string;
  isPublic?: boolean;
  setIsPublic?: (isPublic: boolean) => void;
  itemType?: "dataset" | "chart" | "report";
  embedLink?: string;
}

const ShareComponent = ({
  embedLink,
  itemType,
  shareURL,
  isPublic,
  setIsPublic,
}: ShareComponentProps) => {
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [copied, setCopied] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"share" | "embed">("share");

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
            width: 350px;
            padding: 10px 16px;
            display: flex;
            flex-direction: column;
            gap: 10px;

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
        {itemType === "chart" ? (
          <Tabs
            activeTab={activeTab}
            tabs={[
              {
                value: "share",
                label: "Share",
              },
              {
                value: "embed",
                label: "Embed Code",
              },
            ]}
            handleSwitch={setActiveTab}
          />
        ) : (
          <div
            css={`
              width: 100%;
              border-bottom: 0.5px solid #adb5bd;
            `}
          />
        )}
        {activeTab === "embed" && itemType === "chart" ? (
          <React.Fragment>
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
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
                Embed Code
              </p>

              <CopyToClipboard text={embedLink!} onCopy={handleCopy}>
                <button
                  css={`
                    height: 38px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 0.5px solid #adb5bd;
                    background: transparent;
                    flex-shrink: 0;
                    cursor: pointer;
                    :hover {
                      opacity: 0.8;
                    }
                    font-family: "GothamNarrow-Bold", sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                  `}
                >
                  <CopyIcon />
                  Copy
                </button>
              </CopyToClipboard>
            </div>

            <textarea
              value={embedLink}
              readOnly
              css={`
                padding: 10px;
                border: 1px solid #adb5bd;
                height: 100px;
                border-radius: 10px;
                background: #dfe3e5;
                text-align: center;
                line-height: 20px;
                font-size: 14px;
                font-weight: 400;
                font-family: "GothamNarrow-Book", sans-serif;
                resize: none;
                &::-webkit-scrollbar {
                  visibility: hidden;
                }
                &::-webkit-scrollbar-track {
                  visibility: hidden;
                }
                &::-webkit-scrollbar-thumb {
                  visibility: hidden;
                }
              `}
            ></textarea>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <div
              css={`
                display: flex;
                align-items: center;
                justify-content: space-between;
              `}
            >
              <div>
                <p
                  css={`
                    margin: 0;
                    line-height: 20px; /* 142.857% */
                    font-size: 14px;
                    font-weight: 400;
                    font-family: "GothamNarrow-Bold", sans-serif;
                  `}
                >
                  Make public
                </p>
                <p
                  css={`
                    margin: 0;
                    font-size: 14px;
                    line-height: 20px; /* 142.857% */
                    margin-top: 5px;
                  `}
                >
                  Anyone with the link can view.
                </p>
              </div>

              <CustomSwitch checked={isPublic} onChange={setIsPublic} />
            </div>
            <p
              css={`
                margin: 0;
                line-height: 20px; /* 142.857% */
                font-size: 14px;
                font-weight: 400;
                font-family: "GothamNarrow-Bold", sans-serif;
              `}
            >
              Link
            </p>{" "}
            {isPublic ? (
              <div
                css={`
                  display: flex;
                  gap: 10px;
                  align-items: center;
                `}
              >
                <input
                  type="text"
                  value={shareURL}
                  readOnly
                  css={`
                    width: 100%;
                    height: 38px;
                    border-radius: 10px;
                    padding: 0 16px;
                    font-size: 16px;
                    border: none;
                    border-bottom: 0.5px solid #98a1aa;
                    background: transparent;
                    font-family: "GothamNarrow-Book", sans-serif;
                  `}
                  data-testid="share-url-input"
                />
                <CopyToClipboard text={shareURL} onCopy={handleCopy}>
                  <button
                    css={`
                      width: 38px;
                      height: 38px;
                      border-radius: 10px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      border: 0.5px solid #adb5bd;
                      background: transparent;
                      flex-shrink: 0;
                      cursor: pointer;
                      :hover {
                        opacity: 0.8;
                      }
                    `}
                  >
                    <CopyIcon />
                  </button>
                </CopyToClipboard>
              </div>
            ) : (
              <div
                css={`
                  padding: 13px 36px;
                  border: 1px solid #adb5bd;
                  border-radius: 10px;
                  background: #dfe3e5;
                  text-align: center;
                  line-height: 20px;
                  font-size: 14px;
                  font-weight: 400;
                  font-family: "GothamNarrow-Book", sans-serif;
                `}
              >
                This asset is private. Turn on "Make public" to share it with
                others.
              </div>
            )}
          </React.Fragment>
        )}
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
