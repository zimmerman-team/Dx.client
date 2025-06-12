import React from "react";
import { BasicSwitch } from "app/components/Switch/BasicSwitch";
import ToggleSwitch from "./toggleSwitch";
import { ReactComponent as DuplicateIcon } from "app/modules/home-module/assets/duplicate.svg";
import { ReactComponent as FacebookIcon } from "app/modules/home-module/assets/facebook-icon.svg";
import { ReactComponent as LinkedinIcon } from "app/modules/home-module/assets/linkedin-icon-black.svg";
import { ReactComponent as InstagramIcon } from "app/modules/home-module/assets/instagram-icon.svg";
import { ReactComponent as MastodonIcon } from "app/modules/home-module/assets/mastodon-icon.svg";
import { copyToClipboard } from "app/utils/copyToClipboard";
import Snackbar from "@material-ui/core/Snackbar";

const Box = (props: { content: string; height: number; id: string }) => {
  return (
    <>
      <div
        css={`
          border-radius: 10px;
          border: 1px solid #adb5bd;
          background: #dfe3e5;
          display: flex;
          height: ${props.height}px;
          justify-content: center;
          align-items: center;
          gap: 10px;
          align-self: stretch;
          margin-top: 10px;
          p {
            margin: 0;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            width: 90%;
            font-size: 14px;
            overflow-wrap: break-word;
          }
        `}
      >
        <p id={props.id}>{props.content}</p>
      </div>
    </>
  );
};
export default function ShareModal(props: {
  setDisplayShareModal: (value: boolean) => void;
  assetURL: string;
}) {
  const [activeTab, setActiveTab] = React.useState("share");
  const [isShareSwitchChecked, setIsShareSwitchChecked] = React.useState(false);
  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
  };
  const [copyAlert, setCopyAlert] = React.useState(false);

  const handleCopyURL = async (url: string) => {
    try {
      await copyToClipboard(url);
      setCopyAlert(true);
    } catch (error) {
      console.error("Failed to copy URL:", error);
    }
  };

  return (
    <div
      css={`
        background: #f1f3f5;
        border-radius: 10px;
        box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
        width: 147px;
        width: 350px;
        padding: 10px 16px;
      `}
    >
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            margin: 0;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            font-size: 14px;
          }
          button {
            background: transparent;
            outline: none;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0px;
          }
        `}
      >
        <p>Share this Asset</p>
        <button onClick={() => props.setDisplayShareModal(false)}>
          <svg
            width="19"
            height="20"
            viewBox="0 0 19 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.06732 15.5413L3.95898 14.433L8.39232 9.99967L3.95898 5.56634L5.06732 4.45801L9.50065 8.89134L13.934 4.45801L15.0423 5.56634L10.609 9.99967L15.0423 14.433L13.934 15.5413L9.50065 11.108L5.06732 15.5413Z"
              fill="#70777E"
            />
          </svg>
        </button>
      </div>

      <div
        css={`
          height: 32px;
          margin-top: 10px;
        `}
      >
        <BasicSwitch
          activeTab={activeTab}
          onTabChange={handleTabSwitch}
          style={{
            radius: 10,
            paddingX: 4,
            backgroundActive: "#231D2C",
            background: "transparent",
            overrideStyles: `
            border: 0.5px solid #ADB5BD;
            `,
          }}
          tabs={[
            {
              label: "Share",
              value: "share",
              testId: "external-search-tab",
              icon: null,
            },
            {
              label: "Embed Code",
              value: "embed",
              testId: "file-upload-tab",
              icon: null,
            },
          ]}
        />
      </div>
      {activeTab === "embed" ? (
        <>
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-top: 10px;
            `}
          >
            <p
              css={`
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                font-size: 14px;
                margin: 0;
              `}
            >
              Embed Code
            </p>
            <button
              onClick={() => handleCopyURL("embed-url")}
              css={`
                outline: none;
                background: transparent;
                border-radius: 10px;
                border: 0.5px solid #adb5bd;
                background: #f1f3f5;
                height: 38px;
                width: 82px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                cursor: pointer;
              `}
            >
              <DuplicateIcon />
              Copy
            </button>
          </div>
          <Box
            height={100}
            id={"embed-url"}
            content={`<iframe 
            src="${props.assetURL}" 
            width="600" 
            height="400" 
            frameborder="0" 
            allowfullscreen>
          </iframe>`}
          />
        </>
      ) : (
        <>
          <div
            css={`
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 53px;
            `}
          >
            <div
              css={`
                display: flex;
                align-items: flex-start;
                flex-direction: column;
                gap: 5px;
                p:first-of-type {
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-size: 14px;
                  margin: 0;
                }
                p:last-of-type {
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  font-size: 12px;
                  line-height: 16px;
                  margin: 0;
                }
              `}
            >
              <p>Make public</p>
              <p>Anyone with the link can view</p>
            </div>
            <div>
              <ToggleSwitch
                checked={isShareSwitchChecked}
                setChecked={setIsShareSwitchChecked}
              />
            </div>
          </div>

          {isShareSwitchChecked ? (
            <div
              css={`
                margin-top: 10px;
              `}
            >
              <p
                css={`
                  font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 20px;
                  letter-spacing: 0%;
                  margin: 0;
                `}
              >
                Link
              </p>
              <div
                css={`
                  margin-top: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  height: 40px;
                  gap: 10px;
                `}
              >
                <div
                  css={`
                    height: 100%;
                    padding: 0 16px;
                    border-radius: 10px;
                    border-radius: 10px;
                    border-bottom: 1px solid #98a1aa;
                    width: 270px;
                    p {
                      overflow: hidden;
                      color: #231d2c;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif;
                      font-size: 16px;
                      margin: 0;
                      width: 90%;
                    }
                  `}
                >
                  <p id="share-url" title={props.assetURL}>
                    {props.assetURL}
                  </p>
                </div>
                <button
                  onClick={() => handleCopyURL("share-url")}
                  css={`
                    outline: none;
                    background: transparent;
                    border-radius: 10px;
                    border: 0.5px solid #adb5bd;
                    background: #f1f3f5;
                    height: 100%;
                    width: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                  `}
                >
                  <DuplicateIcon />
                </button>
              </div>

              <div
                css={`
                  margin-top: 10px;
                  display: flex;
                  align-items: flex-start;
                  gap: 10px;
                  flex: 1 0 0;
                  flex-wrap: wrap;
                  a {
                    outline: none;
                    text-decoration: none;
                    background: transparent;
                    border-radius: 10px;
                    border: 0.5px solid #adb5bd;
                    background: #f1f3f5;
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 8px;
                    padding-left: 12px;
                    width: 154px;
                    cursor: pointer;
                    svg {
                      flex-shrink: 0;
                    }

                    span {
                      color: #231d2c;
                      font-family: "GothamNarrow-Book", "Helvetica Neue",
                        sans-serif;
                      font-size: 14px;
                      line-height: 20px;
                    }
                  }
                `}
              >
                <a
                  href={`https://www.facebook.com/sharer.php?u=${props.assetURL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <FacebookIcon />
                  <span>Facebook</span>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    props.assetURL
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedinIcon />
                  <span>Linkedin</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer.php?u=${props.assetURL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon />
                  <span>Instagram</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer.php?u=${props.assetURL}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MastodonIcon />
                  <span>Mastodon</span>
                </a>
              </div>
            </div>
          ) : (
            <Box
              height={66}
              id=""
              content={`This asset is private. Turn on "Make public" to share it with
          others.`}
            />
          )}
        </>
      )}

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={copyAlert}
        autoHideDuration={5000}
        onClose={() => setCopyAlert(false)}
        message="copied to clipboard"
        data-testid="copied-link-snackbar"
      />
    </div>
  );
}
