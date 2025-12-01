import { APIModel } from "@app/state/api";
import { ApiCallModel } from "@app/state/api/interfaces";

export const DatasetGetList: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/datasets`),
};

export const DatasetGet: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/datasets`),
};

export const DatasetCount: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/datasets/count`),
};
