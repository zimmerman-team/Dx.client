import React from "react";
import AddDatasetFragment from "app/modules/dataset-module/routes/upload-module/upload-steps/step1/addDatasetFragment";
import ExternalSearch, {
  IExternalDataset,
} from "app/modules/dataset-module/routes/upload-module/upload-steps/step1/externalSearch";
interface UploadYourDataProps {
  addDatasetFragmentProps: {
    onFileSubmit: (file: File) => void;
    disabled: boolean;
    processingError: string | null;
    setActiveOption: React.Dispatch<React.SetStateAction<string | null>>;
    activeOption: string | null;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  };

  externalSearchProps: {
    handleDownload: (dataset: IExternalDataset) => void;
  };
}
export default function UploadYourData(props: UploadYourDataProps) {
  return (
    <>
      <AddDatasetFragment {...props.addDatasetFragmentProps} />
      <div
        css={`
          height: 50px;
        `}
      />
      <div
        css={`
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        `}
      >
        <div
          css={`
            height: 1px;
            flex: 1;
            border: 1px solid #868e96;
          `}
        />
        <p
          css={`
            flex-basis: 22px;
            color: #231d2c;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            line-height: normal;
            margin: 0;
            text-align: center;
          `}
        >
          OR
        </p>
        <div
          css={`
            height: 1px;
            flex: 1;
            border: 1px solid #868e96;
          `}
        />
      </div>
      <div
        css={`
          height: 50px;
        `}
      />
      <div>
        <ExternalSearch {...props.externalSearchProps} />
      </div>
    </>
  );
}
