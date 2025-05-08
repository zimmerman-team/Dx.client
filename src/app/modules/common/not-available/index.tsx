import React from "react";
import { PrimaryButton } from "app/components/Styled/button";
import { ReactComponent as SmileIcon } from "./asset/smile.svg";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { shareAssetDetailsAtom } from "app/state/recoil/atoms";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export default function NotAvailableOnMobile() {
  const isTablet = useMediaQuery("(min-width:744px)"); //at this breakpoint, we limit user creation abilities
  const content = useRecoilValue(shareAssetDetailsAtom);
  const shareData = {
    title: "Dataxplorer",
    text: content.title,
    url: content.assetURL,
  };
  const history = useHistory();
  const location = useLocation();
  const [result, setResult] = React.useState("");

  const handleShare = async () => {
    try {
      await navigator.share(shareData);
      setResult("Link shared successfully");
    } catch (err) {
      setResult(`Error: ${err}`);
    }
  };

  const handleBackToPreview = () => {
    const currentPath = location.pathname.split("/");
    currentPath.pop();
    const pathToGo = currentPath.join("/");
    history.push(pathToGo);
  };

  React.useEffect(() => {
    if (isTablet) {
      history.goBack();
    }
  }, [isTablet]);

  return (
    <div
      css={`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100vh;
      `}
    >
      <div
        css={`
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        `}
      >
        <SmileIcon />

        <h1
          css={`
            font-family: "GothamNarrow-Bold", sans-serif;
            font-weight: 400;
            font-size: 24px;
            line-height: 100%;
            letter-spacing: 0%;
            text-align: center;
            margin-top: 42px;
            color: #6061e5;
            width: 98%;
          `}
        >
          Sorry, editing feature is not supported on mobile.
        </h1>
        <p
          css={`
            font-family: "GothamNarrow-Book", sans-serif;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            margin: 0px;
            margin-top: 8px;
            width: 92%;
          `}
        >
          This feature is not supported on mobile due to layout limitation.
          Please switch to tablet or desktop to unlock the editing feature.
        </p>
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            margin-top: 32px;
            button {
              height: 48px;
              font-size: 16px;
              width: 100%;
            }
          `}
        >
          <PrimaryButton
            onClick={handleShare}
            bg="dark"
            size="big"
            id="share-button"
          >
            Open on Another Device
          </PrimaryButton>

          <PrimaryButton bg="light" size="big" onClick={handleBackToPreview}>
            Back to Preview
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
