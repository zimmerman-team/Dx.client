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
    setFormDetails: React.Dispatch<
      React.SetStateAction<{
        name: string;
        description: string;
        category: string;
        public: boolean;
        source: string;
        sourceUrl: string;
      }>
    >;
    handleDownload: (dataset: IExternalDataset) => void;
    setProcessingError: React.Dispatch<React.SetStateAction<string | null>>;
    setActiveStep: React.Dispatch<React.SetStateAction<number>>;
    searchValue: string | undefined;
    setSearchValue: React.Dispatch<React.SetStateAction<string | undefined>>;
    openSearch: boolean;
    setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
    sources: string[];
    setSources: React.Dispatch<React.SetStateAction<string[]>>;
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
          <h2>Search External Data Sources</h2>
          <p>
            External search allows you to search and import data from WHO, World
            Bank, The Global Fund, Kaggle and the Humanitarian Data exchange.{" "}
          </p>
        </div>
        <div
          css={`
            height: 30px;
          `}
        />
        <ExternalSearch {...props.externalSearchProps} />
      </div>
    </>
  );
}
