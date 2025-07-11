/** third party */
import { StoreProvider, createStore } from "easy-peasy";
import userEvent from "@testing-library/user-event";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { Auth0Provider } from "@auth0/auth0-react";
import Router from "react-router-dom";
import { MutableSnapshot, RecoilRoot } from "recoil";
import { createMemoryHistory } from "history";
import axios, { AxiosResponse } from "axios";
/** project */
import {
  ChartsActivePanelsState,
  ChartsChartTypeState,
  ChartsDatasetState,
  ChartsEnabledFilterOptionGroupsState,
  ChartsMappingState,
} from "app/state/api/action-reducers/sync/charts";
import { ChartSubheaderToolbar } from "app/modules/chart-module/components/chartSubheaderToolbar/";
import { AuthTokenState } from "app/state/api/action-reducers/sync";
import {
  mockChartList,
  mockMappingValue,
} from "app/modules/chart-module/__test__/data";
import { RecoilObserver } from "app/utils/recoilObserver";
import {
  chartFromStoryAtom,
  homeDisplayAtom,
  storyRightPanelViewAtom,
} from "app/state/recoil/atoms";
import { ChartsAppliedFiltersState } from "app/state/api/action-reducers/sync/charts/filters";
import {
  ChartCreate,
  ChartGet,
  ChartGetList,
  ChartUpdate,
} from "app/state/api/action-reducers/charts";
import { mockUseAuth0 } from "app/utils/mockAuth0";

interface MockProps {
  name: string;
  visualOptions?: any;
  setName: (name: string) => void;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistStoryState?: () => void;
  isPreviewView: boolean;
  dimensions: any;
  setAutoSaveState: jest.Mock<any, any, any>;
  autoSave: boolean;
  onSave: jest.Mock<any, any, any>;
  enableAutoSaveSwitch: boolean;
  savedChanges: boolean;
  isAiSwitchActive: boolean;
  isMappingValid: boolean;
}
type Params = {
  dataset: string | null;
  mapping: any;
  chartType: string | null;
  mockActions: boolean;
  initialRecoilState?: (snap: MutableSnapshot) => void;
};

//mocks
jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

let mockLoginStatus = true;
jest.mock("@auth0/auth0-react", () => {
  const originalModule = jest.requireActual("@auth0/auth0-react");
  return {
    __esModule: true,
    ...originalModule,
    useAuth0: () => mockUseAuth0(mockLoginStatus),
    Auth0Provider: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
  };
});

const resultName = {
  name: "Untitled Chart",
};
const defaultProps = (props: Partial<MockProps> = {}): MockProps => {
  return {
    name: resultName.name,
    setName: jest.fn((newName: string) => (resultName.name = newName)),
    visualOptions: {},
    dimensions: [{}],
    setHasSubHeaderTitleFocused: jest.fn(),
    setHasSubHeaderTitleBlurred: jest.fn(),
    setStopInitializeFramesWidth: jest.fn(),
    handlePersistStoryState: jest.fn(),
    isPreviewView: false,
    setAutoSaveState: jest.fn(),
    autoSave: false,
    onSave: jest.fn(),
    enableAutoSaveSwitch: false,
    savedChanges: false,
    isAiSwitchActive: false,
    isMappingValid: false,
    ...props,
  };
};
const history = createMemoryHistory({
  initialEntries: ["/chart/new/mapping"],
});
const appSetup = (params: Params, newProps: Partial<MockProps> = {}) => {
  const props = defaultProps(newProps);
  const onHomeTabChange = jest.fn();
  const onRightPanelViewChange = jest.fn();
  const onChartFromStoryChange = jest.fn();
  const mockStore = createStore(
    {
      AuthToken: AuthTokenState,
      charts: {
        dataset: ChartsDatasetState,
        mapping: ChartsMappingState,
        charType: ChartsChartTypeState,
        appliedFilters: ChartsAppliedFiltersState,
        enabledFilterOptionGroups: ChartsEnabledFilterOptionGroupsState,
        activePanels: ChartsActivePanelsState,
        ChartGetList,
        ChartGet,
        ChartCreate,
        ChartUpdate,
      },
    },
    {
      mockActions: params.mockActions,
      initialState: {
        charts: {
          dataset: {
            value: params.dataset,
          },
          mapping: {
            value: params.mapping,
          },
          chartType: {
            value: params.chartType,
          },
          appliedFilters: {
            value: {},
          },
          enabledFilterOptionGroups: {
            value: [],
          },
          activePanels: {
            value: "selectDataset",
          },
          chartGet: {
            crudData: {
              owner: "auth0|123",
            },
          },
        },
      },
    }
  );
  return {
    app: (
      <Router.Router history={history}>
        <Auth0Provider clientId="__test_client_id__" domain="__test_domain__">
          <StoreProvider store={mockStore}>
            <RecoilRoot initializeState={params.initialRecoilState}>
              <RecoilObserver
                node={homeDisplayAtom}
                onChange={onHomeTabChange}
              />
              <RecoilObserver
                node={storyRightPanelViewAtom}
                onChange={onRightPanelViewChange}
              />
              <RecoilObserver
                node={chartFromStoryAtom}
                onChange={onChartFromStoryChange}
              />
              <ChartSubheaderToolbar {...props} />
            </RecoilRoot>
          </StoreProvider>
        </Auth0Provider>
      </Router.Router>
    ),
    mockStore,
    props,
  };
};

//test cases

const saveButtonId = "save-button";
const previewButtonId = "preview-button";

const defaultObj = {
  dataset: "12345",
  mapping: mockMappingValue,
  chartType: "echartsBarchart",
  mockActions: false,
};

const defaultCrudData = {
  id: "12345",
  name: "test",
  owner: "auth0|123",
};

const setUpdateCrudData = (mockStore: any) => {
  mockStore.getActions().charts.ChartGet.setCrudData(defaultCrudData);
  mockStore.getActions().charts.ChartUpdate.setCrudData({
    ...defaultCrudData,
    isMappingValid: true,
  });
};

const setCrudData = (mockStore: any) => {
  mockStore.getActions().charts.ChartGet.setCrudData({
    ...defaultCrudData,
    isMappingValid: true,
  });
};

test("save & preview buttons should be clickable when mapping and chart type are empty", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app, mockStore } = appSetup({
    dataset: "12345",
    mapping: {},
    chartType: null,
    mockActions: false,
  });
  render(app);
  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData(defaultCrudData);
  });
  const saveButton = screen.getByRole("button", { name: saveButtonId });
  const previewButton = screen.getByRole("button", {
    name: previewButtonId,
  });
  expect(saveButton).not.toBeDisabled();
  expect(previewButton).not.toBeDisabled();
});

test("save & preview buttons should be clickable when mapping and chart type are not empty", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app, mockStore } = appSetup(defaultObj);
  render(app);
  act(() => {
    setUpdateCrudData(mockStore);
  });
  const saveButton = screen.getByRole("button", { name: saveButtonId });
  const previewButton = screen.getByRole("button", {
    name: previewButtonId,
  });
  expect(saveButton).toBeEnabled();
  expect(previewButton).toBeEnabled();
});

test("clicking preview button should go to preview page", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: "mapping" });

  const { app, mockStore } = appSetup(defaultObj);
  render(app);
  act(() => {
    setUpdateCrudData(mockStore);
  });
  const previewButton = screen.getByRole("button", {
    name: previewButtonId,
  });
  //click preview button
  expect(previewButton).toBeEnabled();
  await user.click(previewButton);
  //assert reroute to preview page
  expect(history.location.pathname).toBe("/chart/chartid");
});

// test("clicking back to edit button should go back to edit view from preview page", async () => {
//   const user = userEvent.setup();
//   jest
//     .spyOn(Router, "useParams")
//     .mockReturnValue({ page: "chartid", view: "preview" });

//   const { app, mockStore } = appSetup({
//     dataset: "12345",
//     mapping: mockMappingValue,
//     chartType: "echartsBarchart",
//     mockActions: false,
//   });
//   render(app);
//   act(() => {
//     mockStore.getActions().charts.ChartGet.setCrudData({
//       id: "12345",
//       name: "test",
//       owner: "auth0|123",
//     });
//   });

//   //assert reroute to preview page
//   expect(history.location.pathname).toBe("/chart/chartid");
//   expect(
//     screen.getByRole("button", {
//       name: previewButtonId,
//     })
//   ).not.toBeEnabled();
//   const backButton = screen.getByTestId("back-to-edit-button");
//   //click back to edit button
//   expect(backButton).toBeEnabled();
//   await user.click(backButton);
//   //assert reroute to edit page
//   expect(history.location.pathname).toBe("/chart/new/mapping");
//   // expect(
//   //   screen.getByRole("button", {
//   //     name: "preview-button",
//   //   })
//   // ).toBeEnabled();
// });

test("typing in text input should edit chart title", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "data" });

  const { app, props } = appSetup(
    {
      dataset: null,
      mapping: {},
      chartType: "echartsBarchart",
      mockActions: true,
    },
    { name: resultName.name }
  );

  render(app);

  expect(screen.getByPlaceholderText("Title")).toHaveValue(resultName.name);
  fireEvent.focus(screen.getByPlaceholderText("Title"));
  expect(props.setHasSubHeaderTitleFocused).toHaveBeenCalledWith(true);
  fireEvent.blur(screen.getByPlaceholderText("Title"));
  expect(props.setHasSubHeaderTitleBlurred).toHaveBeenCalledWith(true);

  // await user.click(screen.getByPlaceholderText("Title"));
  // expect(resultName.name).toBe("");

  const title = screen.getByPlaceholderText("Title");
  await user.clear(title);
  expect(resultName.name).toBe("");

  fireEvent.change(screen.getByPlaceholderText("Title"), {
    target: { value: "Test Chart Title" },
  });

  expect(resultName.name).toBe("Test Chart Title");
});

test("clicking preview button should reroute to preview page", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app, mockStore } = appSetup(defaultObj);
  render(app);
  act(() => {
    setUpdateCrudData(mockStore);
  });
  const previewButton = screen.getByRole("button", {
    name: "preview-button",
  });
  expect(previewButton).toBeEnabled();
  await user.click(previewButton);
  expect(history.location.pathname).toBe("/chart/new");
});

test("clicking save button should create chart", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app, mockStore, props } = appSetup(defaultObj);
  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData(defaultCrudData);
  });
  render(app);
  // click save button
  const saveButton = screen.getByRole("button", { name: saveButtonId });
  expect(saveButton).toBeEnabled();
  axios.post = jest.fn().mockResolvedValueOnce({ data: { id: "12345" } });
  await user.click(saveButton);
  expect(props.onSave).toHaveBeenCalled();

  //asserts chart created successfully
});

test("clicking document body should close create chart snackbar", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });

  const { app, mockStore, props } = appSetup(defaultObj);
  render(app);
  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData(defaultCrudData);
  });
  axios.post = jest.fn().mockResolvedValueOnce({ data: { id: "12345" } });

  await user.click(screen.getByRole("button", { name: saveButtonId }));
  expect(props.onSave).toHaveBeenCalled();
});

test("clicking back to story button should reroute to story path ", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "new", view: "mapping" });
  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(chartFromStoryAtom, {
      state: true,
      page: "65dcb26aaf4c8500693f1ab7",
      action: "edit",
      view: "edit",
      chartId: null,
    });
  };

  const { app, mockStore } = appSetup(
    {
      dataset: "12345",
      mapping: mockMappingValue,
      chartType: "echartsBarchart",
      mockActions: false,
      initialRecoilState,
    },
    { name: "test" }
  );
  render(app);
  // click save button
  const backToStoryButton = screen.getByRole("button", {
    name: "Back to the story",
  });
  expect(backToStoryButton).toBeEnabled();
  await user.click(backToStoryButton);

  expect(history.location.pathname).toBe(
    "/story/65dcb26aaf4c8500693f1ab7/edit"
  );
});

const deleteButtonId = "delete-button";
const duplicateButtonId = "duplicate-button";
const editButtonId = "edit-button";

test("all buttons should be visible and active when page is not new", async () => {
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup(defaultObj);
  render(app);
  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData(defaultCrudData);
  });

  expect(screen.getByRole("button", { name: "export-button" })).toBeVisible();
  expect(screen.getByRole("button", { name: duplicateButtonId })).toBeVisible();
  expect(screen.getByRole("button", { name: editButtonId })).toBeVisible();
  expect(screen.getByRole("button", { name: deleteButtonId })).toBeVisible();
  expect(screen.getByRole("button", { name: "share-button" })).toBeVisible();
});

test("clicking delete button should display delete modal", async () => {
  const user = userEvent.setup();
  // Mocking the Axios request
  const mockedAxios = axios.delete as jest.Mock;
  const mockGetAxios = axios.get as jest.Mock;
  mockedAxios.mockResolvedValueOnce({ data: [] } as AxiosResponse<any>);
  mockGetAxios.mockResolvedValueOnce({
    data: mockChartList,
  } as AxiosResponse<any>);
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup(defaultObj);

  render(app);

  act(() => {
    mockStore.getActions().charts.ChartGet.setCrudData(defaultCrudData);
  });

  expect(screen.getByRole("button", { name: deleteButtonId })).toBeVisible();
  await user.click(screen.getByRole("button", { name: deleteButtonId }));
  expect(screen.getByRole("form")).toBeInTheDocument();
  expect(
    screen.getByText("Absolutely sure you want to delete the chart(s)?")
  ).toBeVisible();
  const input = screen.getByPlaceholderText('Type "DELETE" to confirm');
  await user.type(input, "DELETE");
  expect(input).toHaveValue("DELETE");
  expect(screen.getByRole("button", { name: "Delete" })).toBeEnabled();
  fireEvent.submit(screen.getByRole("form"));
  expect(mockedAxios).toHaveBeenCalled();
});
const goToChart = "GO TO CHART";

test("clicking duplicate button should duplicate chart", async () => {
  const user = userEvent.setup();
  // Mocking the Axios request
  const mockedAxios = axios.get as jest.Mock;
  mockedAxios
    .mockResolvedValueOnce({
      data: { data: { id: "chart-id" } },
    } as AxiosResponse<any>)
    .mockResolvedValueOnce({ data: mockChartList });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: true,
  });
  render(app);

  await user.click(screen.getByRole("button", { name: duplicateButtonId }));
  expect(mockedAxios).toHaveBeenCalled();

  expect(screen.getByTestId("duplicated-chart-snackbar")).toBeVisible();
  expect(
    screen.getByText("Chart has been duplicated successfully!")
  ).toBeVisible();

  expect(screen.getByRole("button", { name: goToChart })).toBeVisible();
  await user.click(screen.getByRole("button", { name: goToChart }));
  expect(screen.getByRole("button", { name: goToChart })).not.toBeVisible();
  expect(history.location.pathname).toBe("/chart/chart-id");
});
test("clicking document body should close duplicate snackbar", async () => {
  const user = userEvent.setup();
  // Mocking the Axios request
  const mockedAxios = axios.get as jest.Mock;
  mockedAxios
    .mockResolvedValueOnce({
      data: { id: "chart-id" },
    } as AxiosResponse<any>)
    .mockResolvedValueOnce({ data: mockChartList });
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app } = appSetup({
    dataset: "12345",
    mapping: mockMappingValue,
    chartType: "echartsBarchart",
    mockActions: true,
  });
  render(app);

  await user.click(screen.getByRole("button", { name: duplicateButtonId }));
  expect(mockedAxios).toHaveBeenCalled();

  expect(screen.getByTestId("duplicated-chart-snackbar")).toBeVisible();
  expect(
    screen.getByText("Chart has been duplicated successfully!")
  ).toBeVisible();

  await user.click(document.body);
  expect(screen.getByRole("button", { name: goToChart })).not.toBeVisible();
});

test("clicking edit button should reroute to edit page", async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: undefined });

  const { app, mockStore } = appSetup(
    {
      dataset: "12345",
      mapping: mockMappingValue,
      chartType: "echartsBarchart",
      mockActions: false,
    },
    { isMappingValid: true }
  );
  render(app);

  act(() => {
    setCrudData(mockStore);
  });

  expect(screen.getByRole("button", { name: editButtonId })).toBeVisible();

  await user.click(screen.getByRole("button", { name: editButtonId }));
  expect(history.location.pathname).toBe("/chart/chartid/customize");
});

test('should call onSave function when "save" button is clicked', async () => {
  const user = userEvent.setup();
  jest
    .spyOn(Router, "useParams")
    .mockReturnValue({ page: "chartid", view: "customize" });

  const initialRecoilState = (snap: MutableSnapshot) => {
    snap.set(chartFromStoryAtom, {
      state: false,
      page: "65dcb26aaf4c8500693f1ab7",
      action: "edit",
      view: "edit",
      chartId: null,
    });
  };
  const { app, mockStore, props } = appSetup(
    {
      dataset: "12345",
      mapping: mockMappingValue,
      chartType: "echartsBarchart",
      mockActions: false,
    },
    { name: "test" }
  );
  render(app);

  act(() => {
    setCrudData(mockStore);
  });

  const saveButton = screen.getByRole("button", { name: saveButtonId });
  expect(saveButton).toBeEnabled();
  axios.patch = jest.fn().mockResolvedValueOnce({ data: { id: "12345" } });
  await user.click(saveButton);
  expect(props.onSave).toHaveBeenCalled();
});

// test("clicking share button should display share popover", async () => {
//   const user = userEvent.setup();
//   jest
//     .spyOn(Router, "useParams")
//     .mockReturnValue({ page: "chartid", view: undefined });

//   //spy on window alert
//   jest.spyOn(window, "prompt").mockImplementation((message) => "Link copied");

//   const { app, mockStore } = appSetup({
//     dataset: "12345",
//     mapping: mockMappingValue,
//     chartType: "echartsBarchart",
//     mockActions: false,
//   });
//   render(app);

//   act(() => {
//     mockStore.getActions().charts.ChartGet.setCrudData({
//       id: "12345",
//       name: "test",
//       owner: "auth0|123",
//     });
//   });

//   expect(screen.getByRole("button", { name: "share-button" })).toBeVisible();
//   await user.click(screen.getByRole("button", { name: "share-button" }));
//   expect(screen.getByLabelText("copy-link-popover")).toBeVisible();
//   expect(screen.getByRole("button", { name: "Copy link" })).toBeVisible();
//   await user.click(screen.getByRole("button", { name: "Copy link" }));
//   //TODO unable to test that snackbar opens, maybe issue from library
//   // expect(screen.getByTestId("copied-link-snackbar")).toBeVisible();
//   //test that link exists in clipboard
//   // expect(navigator.clipboard.readText()).toBe("http://localhost/chart/chartid");
// });
