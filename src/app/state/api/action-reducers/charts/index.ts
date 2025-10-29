import { APIModel } from "@app/state/api";
import { ApiCallModel } from "@app/state/api/interfaces";

export const ChartGet: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart`),
};

export const ChartGetInStory: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart`),
};

export const ChartCreate: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart`),
};

export const ChartUpdate: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart`),
};

export const ChartDelete: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart`),
};

export const ChartDuplicate: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart/duplicate`),
};

export const ChartGetList: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/charts`),
};

export const ChartsCount: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/charts/count`),
};
export const ChartTypesSuggest: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/chart-types/ai-suggestions`),
};
