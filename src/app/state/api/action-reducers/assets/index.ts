import { APIModel } from "@app/state/api";
import { ApiCallModel } from "@app/state/api/interfaces";

export const AssetGetList: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/assets`),
};

export const AssetsCount: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/assets/count`),
};
