import {
  EditorState,
  convertFromRaw,
  Modifier,
  ContentState,
  DraftHandleValue,
  convertToRaw,
} from "draft-js";

export const onCopy = (editorState: EditorState) => {
  const selection = editorState.getSelection();
  const content = editorState.getCurrentContent();

  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const blockMap = content.getBlockMap();

  let inSelection = false;

  const selectedBlocks = blockMap
    .toSeq()
    .filter((_, key) => {
      if (key === startKey) inSelection = true;
      if (key === endKey) {
        return true;
      }
      return inSelection;
    })
    .toOrderedMap();

  const blocksArray = selectedBlocks.toArray();
  const fragmentContent = ContentState.createFromBlockArray(blocksArray);
  const rawFragment = convertToRaw(fragmentContent);
  const selectedText = selectedBlocks
    .toArray()
    .map((block) => block.getText())
    .join("\n");
  localStorage.setItem(
    "draftClipboard",
    JSON.stringify({
      content: rawFragment,
      plain: selectedText,
    })
  );
  console.log("📋 Copied fragment:", rawFragment);
};

export const handlePaste = (
  text: string,
  html: string | undefined,
  editorState: EditorState,
  setEditorState: (state: EditorState) => void
): DraftHandleValue => {
  const rawData = localStorage.getItem("draftClipboard");
  if (!rawData) return "not-handled";

  try {
    const parsed = JSON.parse(rawData);
    const storedText = parsed.plain?.trim();
    const clipboardText = text?.trim();

    const isMatch = storedText && clipboardText && storedText === clipboardText;

    if (!isMatch) {
      console.log(
        "📋 Clipboard differs from localStorage. Letting Draft handle it."
      );
      return "not-handled";
    }
    const fragmentContent = convertFromRaw(parsed.content);

    // 🧱 Get the blocks from the fragment
    const fragmentBlockMap = fragmentContent.getBlockMap();

    // 🪄 Insert into the current content at the current selection
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContent = Modifier.replaceWithFragment(
      currentContent,
      selection,
      fragmentBlockMap
    );

    const newEditorState = EditorState.push(
      editorState,
      newContent,
      "insert-fragment"
    );

    setEditorState(newEditorState);
    return "handled";
  } catch (err) {
    console.error("Paste error:", err);
    return "not-handled";
  }
};
