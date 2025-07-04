import { PrimaryButton } from "app/components/Styled/button";
import React from "react";
import MetaData, { MetadataProps } from "./metaData";
import TablePreview, {
  FinishedFragmentProps,
} from "app/modules/dataset-module/routes/upload-module/upload-steps/step2/TablePreview";
import { isValidUrl } from "app/utils/emailValidation";
import { useHistory, useLocation } from "react-router-dom";
import { useStoreActions } from "app/state/store/hooks";

interface DescribeAndSaveProps {
  metadata: Omit<
    MetadataProps,
    "errorState" | "setErrorState" | "handleSubmit"
  >;
  tablePreview?: FinishedFragmentProps;
  setActiveStep?: React.Dispatch<React.SetStateAction<number>>;
  fileName?: string;
}
export default function DescribeAndSave(props: DescribeAndSaveProps) {
  const history = useHistory();
  const setDatasetId = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );
  const [isSaveEnabled, setIsSaveEnabled] = React.useState(false);
  const [errorState, setErrorState] = React.useState({
    name: { state: false, message: "" },
    description: { state: false, message: "" },
    category: { state: false, message: "" },
    source: { state: false, message: "" },
    sourceUrl: { state: false, message: "" },
  });
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const storyPage = queryParams.get("page") as string;

  const {
    public: isPublic,
    sourceUrl,
    ...mandatoryFields
  } = props.metadata.formDetails;
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    //form validation before submitting
    for (const key in mandatoryFields) {
      if (
        mandatoryFields[key as keyof typeof mandatoryFields] === "" &&
        key !== "sourceUrl"
      ) {
        setErrorState((prev) => ({
          ...prev,
          [key]: { state: true, message: "" },
        }));
        return;
      } else {
        setErrorState((prev) => ({
          ...prev,
          [key]: { state: false, message: "" },
        }));
      }
    }
    if (!isValidUrl(sourceUrl)) {
      setErrorState((prev) => ({
        ...prev,
        sourceUrl: { state: true, message: "Please input a valid URL" },
      }));
      return;
    }

    if (Object.values(mandatoryFields).every((value) => value !== "")) {
      props.metadata.onSubmit(props.metadata.formDetails);
    } else {
      console.log("form errors", mandatoryFields);
    }
  };

  React.useEffect(() => {
    const isFormValid = Object.values(mandatoryFields).every(
      (value) => value !== ""
    );
    setIsSaveEnabled(isFormValid);
  }, [props.metadata.formDetails]);

  return (
    <>
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
            <h2>Describe your data. </h2>
            <p>{props.fileName}</p>
          </div>
          <div
            css={`
              display: flex;
              align-items: center;
              gap: 10px;

              button:last-of-type,
              button:nth-of-type(2) {
                height: 44px;
                border-radius: 10px;
                display: flex;
                justify-content: space-between;
                padding: 12px 16px;
                gap: 28px;
                &:disabled {
                  color: #868e96;
                  border-radius: 10px;
                  border: 1px solid #98a1aa;
                  background: #cfd4da;
                  svg {
                    path {
                      fill: #8d8d8d;
                    }
                  }
                }
              }
            `}
          >
            <PrimaryButton
              size="small"
              bg="light"
              onClick={() => {
                props.setActiveStep ? props.setActiveStep(0) : history.goBack();
              }}
            >
              Go Back
            </PrimaryButton>

            <PrimaryButton
              size="small"
              bg="light"
              disabled={!isSaveEnabled}
              onClick={(e) => {
                handleSubmit(e);
                history.push(
                  `/?newlyCreatedId=${props.tablePreview?.datasetId}`
                );
              }}
            >
              Save
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

            <PrimaryButton
              size="small"
              bg="light"
              disabled={!isSaveEnabled}
              onClick={(e) => {
                handleSubmit(e);
                setDatasetId(props.tablePreview?.datasetId || "");
                history.push(
                  `/chart/new/chart-type?loadataset=true${
                    storyPage ? `&fromstory=true&page=${storyPage}` : ""
                  }`
                );
              }}
            >
              Save and Chart It
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
          </div>
        </div>
        <div
          css={`
            height: 50px;
          `}
        />
        <MetaData
          {...props.metadata}
          errorState={errorState}
          setErrorState={setErrorState}
          handleSubmit={handleSubmit}
        />
        <div
          css={`
            height: 50px;
          `}
        />
        {props.tablePreview && <TablePreview {...props.tablePreview} />}

        <div
          css={`
            height: 60px;
          `}
        />
      </div>
    </>
  );
}
