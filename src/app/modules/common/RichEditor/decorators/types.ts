import { ContentState } from "draft-js";

export type Decorator = {
  contentState: ContentState;
  entityKey: string;
  children: string;
};
