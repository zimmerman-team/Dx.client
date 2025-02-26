import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import HomeFooter from "app/modules/home-module/components/Footer";
import { PrimaryButton } from "app/components/Styled/button";
import { ReactComponent as BgImg } from "app/modules/common/no-match-page/asset/bg-ellipse.svg";
import { InfoIcon } from "app/modules/user-profile-module/component/icons";
import { Container } from "@material-ui/core";

const ErrorFallback = ({
  error,
  showDetails,
  setShowDetails,
  resetErrorBoundary,
}: {
  error: any;
  showDetails: boolean;
  resetErrorBoundary: (...args: any[]) => void;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const onDetailsClick = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div
      css={`
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <BgImg
        css={`
          position: absolute;
          top: 80px;
          z-index: -1;
          left: 0;
          width: 100%;
        `}
      />
      <Container maxWidth="lg">
        <div
          css={`
            width: 100%;
            height: calc(100vh - 113px);
            display: flex;
            align-items: center;
            flex-direction: column;
            justify-content: center;
            position: relative;
          `}
        >
          <div>
            <InfoIcon width={53} height={53} />
          </div>

          <div
            css={`
              p {
                text-align: center;
              }
              p:nth-of-type(1) {
                font-size: 34px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
                color: #6061e5;
                margin: 0;
                line-height: 41px;
              }
              p:nth-of-type(2) {
                font-size: 18px;
                font-family: "GothamNarrow-Medium", "Helvetica Neue", sans-serif;
                color: #231d2c;
                margin: 0;
                margin-top: 24px;
              }
              margin-bottom: 24px;
            `}
          >
            <p>Something went wrong!</p>
            <p>
              We apologize for the inconvenience, but it seems that an
              unexpected error has occurred in our app. Our team has been
              notified and is actively working to resolve the issue.
            </p>
          </div>

          <div
            css={`
              margin-bottom: 24px;
              display: flex;
              flex-direction: column;
              align-items: center;
            `}
          >
            <button
              css={`
                text-decoration: underline;
                background: none;
                border: none;
                display: block;
                cursor: pointer;
                color: #231d2c;
                font-size: 18px;
                font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              `}
              onClick={onDetailsClick}
            >
              Click for details
            </button>
            <pre
              css={`
                text-wrap: balance;
                transition: all 0.3s ease-in-out;
                max-height: ${showDetails ? "1000px" : "0px"};
                visibility: ${showDetails ? "visible" : "hidden"};
              `}
            >
              {error.message}
            </pre>
          </div>
          <div
            css={`
              display: flex;
              gap: 30px;
              justify-content: center;
              @media (max-width: 500px) {
                flex-direction: column;
                align-items: center;
                width: 100%;
              }
            `}
          >
            <a
              href="/"
              css={`
                text-decoration: none;
              `}
            >
              <PrimaryButton bg="dark" size="big">
                Back to Home Page
              </PrimaryButton>
            </a>
            <PrimaryButton
              onClick={() => {
                window.location.href = "/";
              }}
              bg="light"
              size="big"
            >
              Previous page
            </PrimaryButton>
          </div>
        </div>
      </Container>
      <HomeFooter mini />
    </div>
  );
};

export function ErrorBoundaryDX(props: { children: React.ReactNode }) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorFallback
          error={error}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
    >
      {props.children}
    </ErrorBoundary>
  );
}
