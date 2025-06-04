import { decorators } from "app/modules/common/RichEditor/decorators";
import { EditorState, genKey, convertFromRaw } from "draft-js";

export const createHeadingEditorState = () => {
  const rawContent = {
    blocks: [
      {
        key: genKey(),
        text: "",
        type: "title",
        depth: 0,
        inlineStyleRanges: [],
        entityRanges: [],
        data: {},
      },
    ],
    entityMap: {},
  };

  const contentState = convertFromRaw(rawContent);
  return EditorState.createWithContent(contentState, decorators());
};
