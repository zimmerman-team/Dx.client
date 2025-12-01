import { APIModel } from "@app/state/api";
import { ApiCallModel } from "@app/state/api/interfaces";

const GlobalSearch: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/global-search`),
};

export default GlobalSearch;

export const GlobalSearchCharts: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/charts`),
};

export const GlobalSearchStories: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/stories`),
};

export const GlobalSearchDatasets: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/datasets`),
};
