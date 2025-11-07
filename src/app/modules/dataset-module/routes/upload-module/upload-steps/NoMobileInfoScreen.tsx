import React from "react";
import { ReactComponent as PlugIcon } from "app/modules/dataset-module/routes/upload-module/assets/plug.svg";
import { copyTextToClipboard } from "app/utils/copyToClipboard";
import { Snackbar } from "@material-ui/core";
import { updateLog } from "app/utils/updateLog";

export default function NoMobileInfoScreen() {
  const [copyAlert, setCopyAlert] = React.useState<boolean>(false);
  const handleCopyToClipboard = async () => {
    updateLog({
      level: "info",
      message: `Copying link to clipboard: ${window.location.href}`,
    });
    copyTextToClipboard(window.location.href)
      .then(() => {
        setCopyAlert(true);
      })
      .catch((err) => {
        updateLog({
          level: "error",
          message: `Failed to copy to clipboard: ${err}`,
        });
      });
  };

  return (
    <div
      css={`
        border-radius: 10px;
        background: #f1f3f5;
        box-shadow: 0 0 10px 0 rgba(152, 161, 170, 0.05);
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;
        gap: 18px;
        h1 {
          color: #231d2c;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          font-size: 24px;
          margin: 0;
        }
        p {
          color: #231d2c;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          font-size: 14px;
          line-height: 20px;
          margin: 0;
        }
      `}
    >
      <PlugIcon />
      <h1>DATAXPLORER isn't available on mobile yet.</h1>
      <div>
        <p>
          For the best experience, please access DataXplorer from a desktop,
          laptop or tablet device. Our tools are designed for larger screens to
          support advanced data exploration and story building features.
        </p>
        <div
          css={`
            height: 20px;
          `}
        />
        <p>In the meantime, here are some helpful links you can explore:</p>
      </div>
      <div
        css={`
          display: flex;
          flex-direction: column;
          gap: 18px;
          width: 100%;
          button,
          a {
            text-decoration: none;
            border-radius: 10px;
            background: #6061e5;
            height: 41px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            color: #fff;
            font-size: 16px;
            border: none;
            outline: none;

            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          }
        `}
      >
        <a href="/why-dataxplorer">Learn more about DataXplorer</a>

        <button onClick={handleCopyToClipboard}>Try a demo on desktop</button>
        <a href="/contact">Contact us</a>
      </div>
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
