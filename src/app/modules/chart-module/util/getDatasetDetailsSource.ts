import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

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
  if (datasetDetailsProps) {
    sourceUrl =
      datasetDetailsProps.sourceUrl ||
      `${window.location.origin}/dataset/${datasetDetailsProps.id}/detail`;
  } else {
    sourceUrl =
      datasetDetails.sourceUrl ||
      `${window.location.origin}/dataset/${datasetDetails.id}/detail`;
  }
  if (datasetDetailsProps) {
    filename = datasetDetailsProps.sourceUrl || datasetDetailsProps.name;
  } else {
    filename = datasetDetails.sourceUrl || datasetDetails.name;
  }
  sourceUrl = modifiedSourceUrl(sourceUrl);
  return { sourceUrl, filename };
};
