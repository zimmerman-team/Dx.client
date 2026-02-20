import { DatasetListItemAPIModel } from "@app/modules/dataset-module/data";

const modifiedSourceUrl = (url: string) => {
  if (!url) {
    return "";
  }
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  } else {
    return `https://${url}`;
  }
};
export const getDatasetDetailsSource = (
  datasetDetails: DatasetListItemAPIModel,
  datasetDetailsProps?: DatasetListItemAPIModel
) => {
  let sourceUrl;
  let filename;
  if (datasetDetailsProps && Object.keys(datasetDetailsProps).length > 0) {
    sourceUrl =
      datasetDetailsProps.sourceUrl ||
      `${window.location.origin}/dataset/${datasetDetailsProps.id}`;
    filename = datasetDetailsProps.sourceUrl || datasetDetailsProps.name;
  } else {
    sourceUrl =
      datasetDetails.sourceUrl ||
      `${window.location.origin}/dataset/${datasetDetails.id}`;
    filename = datasetDetails.sourceUrl || datasetDetails.name;
  }

  sourceUrl = modifiedSourceUrl(sourceUrl);
  return { sourceUrl, filename };
};
