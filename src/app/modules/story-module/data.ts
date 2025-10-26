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
  ownerName: string;
  uniformBlockTypeStyle: IUniformBlockTypeStyle;
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
  ownerName: "",
  dateColor: "#ffffff",
  isUpdated: false,
  uniformBlockTypeStyle: {
    unstyled: {
      css: null,
      inlineStyles: [],
    },
    title: {
      css: null,
      inlineStyles: [],
    },
    "header-one": {
      css: null,
      inlineStyles: [],
    },
    "header-two": {
      css: null,
      inlineStyles: [],
    },
    "header-three": {
      css: null,
      inlineStyles: [],
    },
    "header-five": {
      css: null,
      inlineStyles: [],
    },
  },
};

export interface IUniformBlockTypeStyle {
  unstyled: {
    css: null;
    inlineStyles: string[];
  };
  title: {
    css: null;
    inlineStyles: string[];
  };
  "header-one": {
    css: null;
    inlineStyles: string[];
  };
  "header-two": {
    css: null;
    inlineStyles: string[];
  };
  "header-three": {
    css: null;
    inlineStyles: string[];
  };
  "header-five": {
    css: null;
    inlineStyles: string[];
  };
}
