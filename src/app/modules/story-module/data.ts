import { EditorState, convertToRaw, RawDraftContentState } from "draft-js";

export interface StoryModel {
  id: string;
  name: string;
  title: string;
  public: boolean;
  showHeader: boolean;
  description: RawDraftContentState;
  heading: RawDraftContentState;
  rows: {
    structure:
      | null
      | "oneByOne"
      | "oneByTwo"
      | "oneByThree"
      | "oneByFour"
      | "oneByFive";

    items: (object | string)[];
    contentWidths: {
      id: string;
      widths: number[];
    };
    contentHeights: {
      id: string;
      heights: number[];
    };
  }[];
  createdDate: Date;
  updatedDate: Date;
  backgroundColor: string;
  titleColor: string;
  descriptionColor: string;
  owner: string;
  dateColor: string;
  isUpdated: boolean;
  ownerName?: string;
}

export const emptyStory: StoryModel = {
  id: "",
  name: "Untitled story",
  title: "",
  public: false,
  description: convertToRaw(EditorState.createEmpty().getCurrentContent()),
  heading: convertToRaw(EditorState.createEmpty().getCurrentContent()),
  showHeader: true,
  rows: [],
  createdDate: new Date(),
  updatedDate: new Date(),
  backgroundColor: "#252c34",
  titleColor: "#ffffff",
  descriptionColor: "#ffffff",
  owner: "",
  dateColor: "#ffffff",
  isUpdated: false,
};
