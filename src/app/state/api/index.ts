/* eslint-disable no-param-reassign */
import get from "lodash/get";
import { action, thunk } from "easy-peasy";
import axios, { AxiosResponse } from "axios";
import {
  ApiModel,
  Errors,
  RequestValues,
  ResponseData,
} from "app/state/api/interfaces";

export const APIModel = <QueryModel, ResponseModel>(
  url: string
): ApiModel<QueryModel, ResponseModel> => ({
  loading: false,
  success: false,
  data: {
    count: 0,
    data: [],
  },
  crudData: null,
  errorData: null,
  planWarning: null,
  onError: action((state, payload: Errors) => {
    state.loading = false;
    state.errorData = payload;
    state.data = {
      count: 0,
      data: [],
    };
    state.crudData = null;
  }),
  onSuccess: action((state, payload: ResponseData<ResponseModel>) => {
    const { addOnData, isUpdateCrudData, ...actualPayload } = payload;
    state.loading = false;
    state.success = true;
    state.errorData = null;

    if (isUpdateCrudData) {
      state.crudData = actualPayload;
    }
    if (addOnData) {
      // @ts-ignore
      state.data = {
        ...state.data,
        count: actualPayload.count,
        // @ts-ignore
        data: [...state.data.data, ...actualPayload.data],
      };
    } else {
      state.data = actualPayload;
    }
  }),
  onSuccessCrudData: action((state, payload: ResponseData<ResponseModel>) => {
    state.loading = false;
    state.success = true;
    state.errorData = null;

    state.crudData = payload;
  }),
  setSuccess: action((state) => {
    state.loading = false;
    state.success = true;
    state.errorData = null;
  }),
  onRequest: action((state) => {
    state.loading = true;
    state.success = false;
    state.errorData = null;
  }),
  fetch: thunk(async (actions, query: RequestValues<QueryModel>) => {
    actions.onRequest();
    let Authorization: string | undefined = `Bearer ${get(
      query,
      "token",
      undefined
    )}`;
    if (query.nonAuthCall) {
      Authorization = undefined;
    }
    axios
      .get(
        `${url}${query.nonAuthCall ? "/public" : ""}${
          query.getId ? `/${query.getId}` : ""
        }${query.filterString ? "?" : ""}${query.filterString ?? ""}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: Authorization as string,
          },
        }
      )
      .then(
        (resp: AxiosResponse) =>
          query.getId || query.storeInCrudData
            ? actions.onSuccessCrudData(resp.data)
            : actions.onSuccess({ ...resp.data, addOnData: false }),
        (error: any) => actions.onError(error.response)
      );
  }),
  setData: action((state, payload: any) => {
    state.data = payload;
  }),
  setCrudData: action((state, payload: any) => {
    state.crudData = payload;
  }),
  setPlanWarning: action((state, payload: any) => {
    state.planWarning = payload;
  }),
  clearPlanWarning: action((state) => {
    state.planWarning = null;
  }),
  clear: action((state) => {
    state.loading = false;
    state.success = false;
    state.data = {
      count: 0,
      data: [],
    };
    state.crudData = null;
    state.errorData = null;
    state.planWarning = null;
  }),
  fetchWithEndpoint: thunk(
    async (actions, query: RequestValues<QueryModel>) => {
      actions.onRequest();
      axios
        .get(
          `${url}/${query.endpoint}${query.filterString ? "?" : ""}${
            query.filterString ?? ""
          }`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then(
          (resp: AxiosResponse) => {
            if (resp.data) {
              return actions.onSuccess({ ...resp.data, addOnData: false });
            }
          },
          (error: any) => actions.onError(error.response)
        );
    }
  ),
  post: thunk(async (actions, query: RequestValues<QueryModel>) => {
    actions.onRequest();
    axios
      .post(url, query.values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${get(query, "token", undefined)}`,
        },
      })
      .then(
        (resp: AxiosResponse) => {
          if (resp.data.data) {
            actions.onSuccess({ ...resp.data.data, isUpdateCrudData: true });
            if (resp.data.planWarning) {
              actions.setPlanWarning(resp.data.planWarning);
            }
          } else if (resp.data) {
            actions.onSuccess({ ...resp.data, isUpdateCrudData: true });
          }
        },
        (error: any) => actions.onError(error.response)
      );
  }),
  patch: thunk(async (actions, query: RequestValues<QueryModel>) => {
    actions.onRequest();
    axios
      .patch(`${url}/${query.patchId}`, query.values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${get(query, "token", undefined)}`,
        },
      })
      .then(
        (resp: AxiosResponse) => actions.onSuccessCrudData(resp.data),

        (error: any) => actions.onError(error.response)
      );
  }),
  delete: thunk(async (actions, query: RequestValues<QueryModel>) => {
    actions.onRequest();
    axios
      .delete(`${url}/${query.deleteId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${get(query, "token", undefined)}`,
        },
      })
      .then(
        (resp: AxiosResponse) => actions.onSuccessCrudData(resp.data),
        (error: any) => actions.onError(error.response)
      );
  }),
});
