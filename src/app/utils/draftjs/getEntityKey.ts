import { EditorState } from "draft-js";

export const getEntityKey = (editorState: EditorState): string | null => {
  const contentState = editorState.getCurrentContent();
  const selectionState = editorState.getSelection();
  const block = contentState.getBlockForKey(selectionState.getStartKey());
  const offset = selectionState.getStartOffset();
  return block.getEntityAt(offset);
};
