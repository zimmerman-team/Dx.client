import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";

export interface IRowFrameStructure {
  rowType:
    | "oneByOne"
    | "oneByTwo"
    | "oneByThree"
    | "oneByFour"
    | "oneByFive"
    | "";

  disableAddRowStructureButton: boolean;
  index: number;
}

const { persistAtom } = recoilPersist();

export const emptyRowsAtom = atom({
  key: "emptyRowsAtom",
  default: false,
});
export const untitledStoryAtom = atom({
  key: "untitledStoryAtom",
  default: false,
});

export const allAssetsViewAtom = atom<"grid" | "table">({
  key: "allAssetsViewAtom",
  default: "grid",
  effects_UNSTABLE: [persistAtom],
});

export const allAssetsSortBy = atom<"name" | "updatedDate" | "createdDate">({
  key: "allAssetsSortBy",
  default: "updatedDate",
  effects_UNSTABLE: [persistAtom],
});

export const allAssetsFilterBy = atom<"allAssets" | "myAssets">({
  key: "allAssetsFilterBy",
  default: "allAssets",
  effects_UNSTABLE: [persistAtom],
});

export const externalDataSortByAtom = atom<
  "name" | "updatedDate" | "createdDate"
>({
  key: "externalDataSortByAtom",
  default: "updatedDate",
  effects_UNSTABLE: [persistAtom],
});

export const shareAssetDetailsAtom = atom<{
  assetURL: string;
  title: string;
}>({
  key: "shareAssetDetailsAtom",
  default: {
    assetURL: "",
    title: "",
  },
});

export const homeDisplayAtom = atom<"all" | "data" | "charts" | "stories">({
  key: "homeDisplayAtom",
  default: "stories",
  effects_UNSTABLE: [persistAtom],
});

export const storyRightPanelViewAtom = atom<
  "elements" | "charts" | "media" | "editHeader"
>({
  key: "storyRightPanelViewAtom",
  default: "charts",
});

export const isChartDraggingAtom = atom<"chart" | "bigNumber" | null>({
  key: "isChartDraggingAtom",
  default: null,
});

export const isDividerOrRowFrameDraggingAtom = atom<{
  state: boolean;
  rowId: string | null;
}>({
  key: "isDividerOrRowFrameDraggingAtom",
  default: {
    state: false,
    rowId: null,
  },
});
export const isChartAIAgentActive = atom<boolean>({
  key: "isChartAIAgentActiveAtom",
  default: true,
});

export const isChartAutoMappedAtom = atom<boolean>({
  key: "isChartAutoMappedAtom",
  default: false,
});

export const storyContentIsResizingAtom = atom<boolean>({
  key: "storyContentIsResizing",
  default: false,
});

export const storyContentContainerWidth = atom<number>({
  key: "storyContentContainerWidth",
  default: 0,
});

export const storyCreationTourStepAtom = atom<number>({
  key: "storyCreationTourStepAtom",
  default: 0,
});

export const loadedDatasetsAtom = atom<DatasetListItemAPIModel[]>({
  key: "loadedDatasetsAtom",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

export const loadedChartsInStoryAtom = atom<string[]>({
  key: "loadedChartsInStoryAtom",
  default: [],
});

export const chartFromStoryAtom = atom<{
  state: boolean;
  view: string;
  page: string;
  action: "create" | "edit" | null;
  chartId: string | null;
}>({
  key: "chartFromStoryAtom",
  default: {
    state: false,
    view: "",
    page: "",
    action: null,
    chartId: null,
  },
  effects_UNSTABLE: [persistAtom],
});

export const dataUploadTabAtom = atom<"search" | "file">({
  key: "dataUploadTabAtom",
  default: "search",
  effects_UNSTABLE: [persistAtom],
});

export const planDialogAtom = atom<{
  open: boolean;
  message: string;
  tryAgain: string;
  onTryAgain: () => void;
}>({
  key: "planDialogAtom",
  default: {
    open: false,
    message: "",
    tryAgain: "",
    onTryAgain: () => {},
  },
});

export const fetchPlanLoadingAtom = atom<boolean>({
  key: "fetchPlanLoadingAtom",
  default: false,
});
