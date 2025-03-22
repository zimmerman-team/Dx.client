import React from "react";
import { ReactComponent as ErrorICon } from "app/modules/dataset-module/routes/upload-module/assets/error-icon.svg";
import { PrimaryButton } from "app/components/Styled/button";
import { formatRemainingTime } from "app/hooks/useOnUploadProgress";

interface ProcessingMetaDataProps {
  setProcessingError: React.Dispatch<React.SetStateAction<string | null>>;
  processingError: string | null;
  fileName: string;
  loaded: string;
  percentageLoaded: number;
  estimatedUploadTime: number;
  processingMessage: string;
  tryAgain: () => void;
}

export default function Processing(props: ProcessingMetaDataProps) {
  return (
    <>
      {props.processingError ? (
        <div
          css={`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #e75656;
            margin-top: 151px;
          `}
        >
          <div
            css={`
              padding: 5px;
            `}
          >
            <ErrorICon width={53} height={53} />
          </div>
          <h2
            css={`
              margin: 0;
              padding: 0;
              margin-top: 8px;
              font-size: 36px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              line-height: normal;
            `}
          >
            Error{" "}
          </h2>
          <p
            css={`
              font-size: 18px;
              text-align: center;
              margin: 0;
              padding: 0;
              margin-top: 8px;
              width: 365px;
              text-align: center;
            `}
            data-testid="error-message"
          >
            {props.processingError}
          </p>

          <PrimaryButton
            onClick={props.tryAgain}
            data-cy="dataset-processing-try-again"
            bg="dark"
            size="small"
            css={`
              margin-top: 24px;
              height: 48px;
              font-size: 16px;
            `}
          >
            Try Again
          </PrimaryButton>
        </div>
      ) : (
        <div
          css={`
            display: flex;
            justify-content: center;
            align-items: center;
            height: calc(100vh - 140px - 72px);
            flex-direction: column;
            @media (max-width: 881px) {
              height: calc(100vh - 156px - 72px);
            }
          `}
        >
          <p
            css={`
              font-size: 18px;
              color: #231d2c;
              text-align: center;
              margin: 0;
              margin-bottom: 40px;
            `}
            dangerouslySetInnerHTML={{
              __html: props.processingMessage || "Data is being processed...",
            }}
          />

          <div
            css={`
              width: 400px;
            `}
          >
            <p
              css={`
                color: #000;
                font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                font-size: 14px;
              `}
            >
              {props.fileName}
            </p>
            <div
              data-testid="progress-bar"
              css={`
                display: flex;
                flex-wrap: wrap;
                width: 400px;
                justify-content: space-between;
                align-items: center;
                p {
                  font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
                  font-size: 12px;
                  color: #adb5bd;
                  margin: 0;
                  line-height: normal;
                  margin-top: 6.42px;
                }
              `}
            >
              <div
                css={`
                  width: 100%;
                  height: 6.42px;

                  background-color: #dfe3e5;

                  border-radius: 3.211px;
                  position: relative;
                `}
              >
                <div
                  css={`
                    width: ${props.percentageLoaded}%;
                    height: 100%;
                    border-radius: 3px;
                    background: linear-gradient(
                      90deg,
                      #6466f1 7.48%,
                      #cea8bc 92.2%
                    );
                  `}
                />
              </div>
              <p>{props.loaded}</p>
              <p data-testid="estimated-time">
                {formatRemainingTime(props.estimatedUploadTime)}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
