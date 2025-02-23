import React from "react";
import Container from "@material-ui/core/Container";
import AssetsList from "./assetsList";
import InfoIcon from "./assets/jsx/info-icon";

export default function NonAuthUserLibrary() {
  return (
    <React.Fragment>
      <div
        css={`
          box-shadow: 0px 0px 10px 0px rgba(152, 161, 170, 0.1);
        `}
      >
        <Container
          maxWidth="lg"
          css={`
            padding: 72px 0;
            @media (max-width: 960px) {
              padding: 40px 32px;
            }
            @media (max-width: 744px) {
              padding: 40px 16px;
            }
          `}
        >
          <div
            css={`
              padding: 16px 40px;
              background: #ffffff;
              border-radius: 12px;
              color: #6061e5;
              box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
            `}
          >
            <div
              css={`
                display: flex;
                gap: 10px;
                align-items: center;
                h3 {
                  margin: 0;
                  font-size: 20px;
                  font-family: "GothamNarrow-Bold", sans-serif;
                  font-weight: 400;
                }
              `}
            >
              <InfoIcon />
              <h3>You're Viewing Default Dataxplorer Assets</h3>
            </div>
            <p
              css={`
                margin: 0;
                margin-top: 10px;
                font-size: 14px;
                font-family: "GothamNarrow-Book", sans-serif;
                line-height: 20px;
              `}
            >
              The items displayed here are default assets from Dataxplorer. Sign
              in to create, customize, and personalize your own assets to match
              your needs.
            </p>
          </div>
          <AssetsList />
        </Container>
      </div>
    </React.Fragment>
  );
}
