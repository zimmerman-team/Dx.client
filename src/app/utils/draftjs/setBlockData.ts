import { ContentState, EditorState, Modifier } from "draft-js";

export function setBlockData(
  currentEditorState: EditorState,
  newEditorState: EditorState | null,
  fieldToChange: string,
  newValue: string,
  newContentState?: ContentState
) {
  const selection = currentEditorState.getSelection();
  let modifiedContentState;

  if (newEditorState) {
    modifiedContentState = newEditorState.getCurrentContent();
  } else if (newContentState) {
    modifiedContentState = newContentState;
  } else {
    modifiedContentState = newEditorState!.getCurrentContent();
  }

  const modifiedContent = Modifier.setBlockData(
    modifiedContentState,
    selection,
    modifiedContentState
      .getBlockForKey(selection.getStartKey())
      .getData()
      .set(fieldToChange, newValue)
  );

  if (newEditorState) {
    newEditorState = EditorState.push(
      newEditorState as EditorState,
      modifiedContent,
      "change-block-data"
    );
  } else {
    newEditorState = currentEditorState;
  }
  return {
    newEditorState,
    contentState: modifiedContent,
  };
}
