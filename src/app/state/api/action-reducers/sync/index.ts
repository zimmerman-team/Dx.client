/* eslint-disable no-param-reassign */
import { action, Action } from "easy-peasy";

export interface DataSourceStateModel {
  value: string;
  setValue: Action<DataSourceStateModel, string>;
}

export const DataSourceState: DataSourceStateModel = {
  value: "TGFOData",
  setValue: action((state, payload: string) => {
    state.value = payload;
  }),
};

export interface DataSourceSnackbarVisibilityStateModel {
  value: boolean;
  setValue: Action<DataSourceSnackbarVisibilityStateModel, boolean>;
}

export const DataSourceSnackbarVisibilityState: DataSourceSnackbarVisibilityStateModel =
  {
    value: false,
    setValue: action((state, payload: boolean) => {
      state.value = payload;
    }),
  };

export interface AuthTokenModel {
  value: string;
  setValue: Action<AuthTokenModel, string>;
}

export const AuthTokenState: AuthTokenModel = {
  value: "",
  setValue: action((state, payload: string) => {
    state.value = payload;
  }),
};

export interface CMSDataValueModel {
  componentsFooter: any | null;
  componentsHeader: any | null;
  pagesHome: any | null;
  pagesDashboard: any | null;
  pagesAbout: any | null;
  pagesWhyDataxplorer: any | null;
  pagesPricing: any | null;
  pagesPartners: any | null;
  pagesContact: any | null;
  pagesWebinar: any | null;
}

export interface CMSDataModel {
  value: CMSDataValueModel;
  setValue: Action<CMSDataModel, CMSDataValueModel>;
}

export const CMSData: CMSDataModel = {
  value: {
    componentsFooter: null,
    componentsHeader: null,
    pagesHome: null,
    pagesDashboard: null,
    pagesAbout: null,
    pagesWhyDataxplorer: null,
    pagesPricing: null,
    pagesPartners: null,
    pagesContact: null,
    pagesWebinar: null,
  },
  setValue: action((state, payload: CMSDataValueModel) => {
    state.value = payload;
  }),
};
