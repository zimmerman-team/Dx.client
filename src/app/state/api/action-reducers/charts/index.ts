import { APIModel } from "app/state/api";
import { ApiCallModel } from "app/state/api/interfaces";

export const ChartGet: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart`),
};

export const ChartGetInStory: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart`),
};

export const ChartCreate: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart`),
};

export const ChartUpdate: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart`),
};

export const ChartDelete: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart`),
};

export const ChartDuplicate: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart/duplicate`),
};

export const ChartGetList: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/charts`),
};

export const ChartsCount: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/charts/count`),
};
export const ChartTypesSuggest: ApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_API}/chart-types/ai-suggestions`),
};
