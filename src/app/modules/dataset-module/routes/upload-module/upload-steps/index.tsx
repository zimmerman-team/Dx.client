/** third party */
import React, { useEffect } from "react";
import axios from "axios";
import Container from "@material-ui/core/Container";
import { useAuth0 } from "@auth0/auth0-react";
/** project */
import { useStoreActions, useStoreState } from "@app/state/store/hooks";
import { useChartsRawData } from "@app/hooks/useChartsRawData";
import { stepcss } from "@app/modules/dataset-module/routes/upload-module/style";
import ObjectId from "@app/utils/ObjectId";
import { useUploadProgress } from "@app/hooks/useOnUploadProgress";
import { IExternalDataset } from "@app/modules/dataset-module/routes/upload-module/upload-steps/step1/externalSearch";
import Stepper from "@app/modules/dataset-module/routes/upload-module/component/stepper";
import { useTitle } from "react-use";
import { DatasetListItemAPIModel } from "@app/modules/dataset-module/data";
import { useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { dataUploadTabAtom, planDialogAtom } from "@app/state/recoil/atoms";
import { APPLICATION_JSON } from "@app/state/api";
import HomeFooter from "@app/modules/home-module/components/Footer";
import UploadYourData from "./step1";
import useBackgroundColor from "@app/hooks/useBackgroundColor";
import PrepareForUse from "./step2";
import DescribeAndSave from "./step3";
import { MOBILE_BREAKPOINT } from "@app/theme";
import NoMobileInfoScreen from "./NoMobileInfoScreen";

interface Props {
  datasetId: string;
  setDatasetId: React.Dispatch<React.SetStateAction<string>>;
}
const steps = [
  {
    title: "Search or Upload Data",
    description: "Upload your file or search federated sources",
  },
  {
    title: "Prepare for Use",
    description: "Process and preview your dataset before charting",
  },
  {
    title: "Describe & Save",
    description: "Name, categorize, and add details to your dataset",
  },
];

function DatasetUploadSteps(props: Props) {
  useTitle("Dataxplorer - Upload Dataset");
  useBackgroundColor("#fff", []);
  const { user } = useAuth0();
  const location = useLocation();
  const token = useStoreState((state) => state.AuthToken.value);
  const [_, setPlanDialog] = useRecoilState(planDialogAtom);
  const [formDetails, setFormDetails] = React.useState({
    name: "",
    description: "",
    category: "",
    public: false,
    source: "",
    sourceUrl: "https://",
  });
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [processingError, setProcessingError] = React.useState<string | null>(
    null
  );
  const [processingMessage, setProcessingMessage] = React.useState("");
  const [processed, setProcessed] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [activeTab, setActiveTab] = useRecoilState(dataUploadTabAtom);
  const [activeOption, setActiveOption] = React.useState<string | null>(null);
  const defaultProcessingError =
    "Data could not be processed, please try again or contact your administrator";
  const loadDatasetDetails = useStoreActions(
    (actions) => actions.dataThemes.DatasetGet.fetch
  );
  const datasetDetails = useStoreState(
    (state) =>
      (state.dataThemes.DatasetGet.crudData ?? {}) as DatasetListItemAPIModel
  );

  React.useEffect(() => {
    if (activeStep === 3) {
      if (token) {
        loadDatasetDetails({
          token,
          getId: props.datasetId,
        });
      } else {
        loadDatasetDetails({
          token,
          getId: props.datasetId,
          nonAuthCall: !token,
        });
      }
    }
  }, [token, props.datasetId, activeStep]);

  const {
    loadedProgress,
    percentageLoadedProgress,
    remainingTime,
    resetProgress,
    onUploadProgress,
  } = useUploadProgress();

  const {
    loadDataset: loadSampleDataset,
    sampleData,
    dataTotalCount,
    dataStats,
    dataTypes,
  } = useChartsRawData({
    visualOptions: () => {},
    setVisualOptions: () => {},
    setChartFromAPI: () => {},
    chartFromAPI: null,
  });

  const moveToNextStep = () => {
    const newActiveStep = activeStep + 1;
    if (newActiveStep > steps.length - 1) {
      setActiveStep(0);
    }
    setActiveStep(newActiveStep);
  };

  React.useEffect(() => {
    if (activeStep === 0) {
      setProcessingError("");
      setProcessingMessage("");
      setProcessed(false);
    }
  }, [activeStep]);

  const onSubmitMetadata = async () => {
    //Post the dataset
    await axios
      .post(
        `${import.meta.env.VITE_API}/datasets`,
        { ...formDetails, authId: user?.sub, id: props.datasetId },
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        if (response?.data.error && response?.data.errorType === "planError") {
          return setPlanDialog({
            open: true,
            message: response?.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
        if (response.data.planWarning) {
          setPlanDialog({
            open: true,
            message: response.data.planWarning,
            tryAgain: "",
            onTryAgain: () => {},
          });
        }
      })
      .catch((error) => {
        console.debug("Dataset creation error", error);
        setProcessingError(defaultProcessingError);
      });
  };

  const dataUploadError = "Dataset upload error";

  const onFileSubmit = (file: File) => {
    setSelectedFile(file);
    const formData = new FormData();
    moveToNextStep();

    const id = ObjectId();

    props.setDatasetId(id); //expose file id to datasetId state; to be used in dataset upload. this is used to link the file to the dataset
    let fieldname = id;
    formData.append(fieldname, file as File);

    axios
      .post(`${import.meta.env.VITE_API}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress,
      })
      .then((response) => {
        //go to next step - metadata
        if (!response.data.error) {
          setProcessed(true);
          loadSampleDataset(
            `${import.meta.env.VITE_API}/chart/sample-data/connect-data/${id}`
          );
          return;
        }
        if (response.data?.errorType !== "planError") {
          setProcessingError(response.data.error);
          console.debug(dataUploadError, response.data.error);
          return;
        }
        if (response.data?.processingMessage) {
          setPlanDialog({
            open: true,
            message: response.data.error,
            tryAgain: "Try another dataset",
            onTryAgain: tryAgain,
          });
          setProcessingMessage(response.data?.processingMessage ?? "");
        } else {
          setPlanDialog({
            open: true,
            message: response.data.error,
            tryAgain: "",
            onTryAgain: () => {},
          });
          setProcessingMessage(response.data.error ?? "");
        }
      })
      .catch((error) => {
        console.debug(dataUploadError, error);
        setProcessingError(defaultProcessingError);
        setSelectedFile(null);
      });
  };

  const handleDownloadExternalDataset = (externalDataset: IExternalDataset) => {
    const id = ObjectId();
    props.setDatasetId(id); //expose file id to datasetId state; to be used in dataset upload
    setActiveStep(1);
    resetProgress();

    setSelectedFile({
      name: externalDataset.name,
      type: "",
      size: 0,
    } as File);
    axios
      .post(
        `${import.meta.env.VITE_API}/external-sources/download`,
        { ...externalDataset, id },
        {
          headers: {
            "Content-Type": APPLICATION_JSON,
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress,
        }
      )
      .then((response) => {
        //populate formDetails with externalDataset fields to be used in metadata
        resetProgress();
        if (response.data.error) {
          setProcessingError(response.data.error);
          console.debug(dataUploadError, response.data.error);
        } else {
          loadSampleDataset(
            `${import.meta.env.VITE_API}/chart/sample-data/connect-data/${id}`
          );

          setFormDetails({
            category: "",
            description: externalDataset.description.substring(0, 150),
            name: externalDataset.name,
            public: false,
            source: externalDataset.source,
            sourceUrl: externalDataset.url,
          });
          //go to next step - metadata
          // setActiveStep(2);
          setProcessed(true);
        }
      })
      .catch((error) => {
        console.debug(dataUploadError, error);
        resetProgress();
        setActiveStep(0);
        setProcessingError(defaultProcessingError);
      });
  };

  const tryAgain = () => {
    setActiveStep(0);
  };

  const disableActiveOption = () => {
    if (activeOption) {
      setActiveOption(null);
    }
  };

  useEffect(() => {
    disableActiveOption();
  }, [activeTab]);

  const renderUploadYourData = () => {
    return (
      <UploadYourData
        addDatasetFragmentProps={{
          activeOption,
          setActiveOption,
          onFileSubmit,
          disabled: false,
          processingError,
          setActiveStep,
        }}
        externalSearchProps={{
          handleDownload: handleDownloadExternalDataset,
        }}
      />
    );
  };
  const currentStep = () => {
    switch (activeStep) {
      case 0:
        return renderUploadYourData();
      case 1:
        return (
          <PrepareForUse
            processing={{
              setProcessingError,
              processingError,
              fileName: (selectedFile && selectedFile.name) as string,
              fileType: (selectedFile && selectedFile.type) || "",
              loaded: loadedProgress,
              percentageLoaded: percentageLoadedProgress,
              estimatedUploadTime: remainingTime,
              processingMessage,
              tryAgain,
              setActiveStep,
              processed,
            }}
            tablePreview={{
              data: sampleData,
              stats: dataStats,
              datasetId: props.datasetId,
              dataTotalCount,
              dataTypes,
              datasetDetails,
              canDatasetEditDelete: true, //if user has just uploaded the dataset, then they
              //own it and can edit it.
            }}
          />
        );
      case 2:
        return (
          <>
            <div
              css={`
                height: 40px;
              `}
            />
            <DescribeAndSave
              metadata={{
                formDetails,
                setFormDetails,
                onSubmit: onSubmitMetadata,
              }}
              fileName={
                (selectedFile && selectedFile.name) || "External Dataset"
              }
              setActiveStep={setActiveStep}
              tablePreview={{
                data: sampleData,
                stats: dataStats,
                datasetId: props.datasetId,
                dataTotalCount,
                dataTypes,
                datasetDetails,
                canDatasetEditDelete: true, //if user has just uploaded the dataset, then they
                //own it and can edit it.
              }}
            />
          </>
        );

      default:
        return renderUploadYourData(); //fallback to first step if no step matches
    }
  };

  return (
    <>
      <div
        css={`
          min-height: calc(100vh - 50px);
          margin-top: 50px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          @media (max-width: 881px) {
            min-height: calc(100vh - 66px);
            margin-top: 66px;
          }
        `}
      >
        <Container maxWidth="lg">
          <div
            css={`
              height: 60px;
            `}
          />
          <h1
            css={`
              color: #231d2c;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              font-size: 40px;
              font-style: normal;
              margin: 0;
            `}
          >
            Connect a Dataset
          </h1>
          <div
            css={`
              height: 30px;
            `}
          />

          <div css={stepcss}>
            {steps.map((tab, index) => (
              <Stepper
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                index={index}
                tab={tab}
                tabs={steps}
                key={tab.title}
              />
            ))}
          </div>
          <div
            css={`
              height: 50px;
            `}
          />

          <>
            <div
              css={`
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  display: none;
                }
              `}
            >
              {currentStep()}
            </div>
            <div
              css={`
                display: none;
                @media (max-width: ${MOBILE_BREAKPOINT}) {
                  display: block;
                }
              `}
            >
              <NoMobileInfoScreen />
            </div>
          </>
        </Container>
        <HomeFooter mini />
      </div>
    </>
  );
}

export default DatasetUploadSteps;
