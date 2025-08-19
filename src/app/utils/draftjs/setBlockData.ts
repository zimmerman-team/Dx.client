import { ContentState, EditorState, Modifier } from "draft-js";

export function setBlockData(
  currentEditorState: EditorState,
  newEditorState: EditorState,
  fieldToChange: string,
  newValue: string
) {
  const selection = currentEditorState.getSelection();
  const modifiedContentState = newEditorState.getCurrentContent();

  const modifiedContent = Modifier.setBlockData(
    modifiedContentState,
    selection,
    modifiedContentState
      .getBlockForKey(selection.getStartKey())
      .getData()
      .set(fieldToChange, newValue)
  );

  newEditorState = EditorState.push(
    newEditorState as EditorState,
    modifiedContent,
    "change-block-data"
  );
  return newEditorState;
}
