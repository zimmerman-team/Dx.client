import React from "react";
import { PrimaryButton } from "app/components/Styled/button";
import Processing, { ProcessingMetaDataProps } from "./processing";
import TableSkeleton from "./tableSkeleton";
import { FinishedFragmentProps } from "app/modules/dataset-module/routes/upload-module/upload-steps/step2/TablePreview";
import TablePreview from "app/modules/dataset-module/routes/upload-module/upload-steps/step2/TablePreview";

export default function PrepareForUse(props: {
  processing: ProcessingMetaDataProps;
  tablePreview: FinishedFragmentProps;
}) {
  return (
    <div>
      <div
        css={`
          height: 50px;
        `}
      />
      <div
        css={`
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        `}
      >
        <div
          css={`
            color: #231d2c;
            > h2 {
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 24px;
              margin: 0;
            }
            > p {
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              margin: 0;
              font-size: 14px;
            }
          `}
        >
          {props.processing.processed ? (
            <>
              <h2>Selected data has been processed!</h2>
              <p>
                {`${props.processing.fileName}.${props.processing.fileType}`}
              </p>
            </>
          ) : (
            <>
              <h2>Selected data is being processed. </h2>
              <p>It can take longer depending on the file size.</p>
            </>
          )}
        </div>
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 10px;

            button:last-of-type {
              height: 44px;
              border-radius: 10px;
              display: flex;
              justify-content: space-between;
              padding: 12px 16px;
              gap: 28px;
            }
          `}
        >
          <PrimaryButton
            size="small"
            bg="light"
            onClick={() => props.processing.setActiveStep(0)}
          >
            Go Back
          </PrimaryButton>
          {props.processing.processed && (
            <PrimaryButton
              size="small"
              bg="light"
              onClick={() => props.processing.setActiveStep(2)}
            >
              Describe and Save
              <svg
                width="15"
                height="13"
                viewBox="0 0 15 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75 0.250977L7.85625 1.1216L12.5938 5.87598H0V7.12598H12.5938L7.85625 11.8591L8.75 12.751L15 6.50098L8.75 0.250977Z"
                  fill="white"
                />
              </svg>
            </PrimaryButton>
          )}
        </div>
      </div>

      {props.processing.processingError ? null : (
        <>
          {props.processing.processed ? (
            <>
              <div
                css={`
                  height: 50px;
                `}
              />{" "}
              <TablePreview {...props.tablePreview} />
            </>
          ) : (
            <>
              <Processing {...props.processing} />
              <div
                css={`
                  height: 50px;
                `}
              />
              <TableSkeleton />
            </>
          )}
        </>
      )}
      <div
        css={`
          height: 60px;
        `}
      />
    </div>
  );
}
