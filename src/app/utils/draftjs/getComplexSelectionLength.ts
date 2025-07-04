import { EditorState } from "draft-js";

export const getComplexSelectionLength = (editorState: EditorState): number => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();

  if (startKey === endKey) {
    return endOffset - startOffset;
  }

  // Get all blocks between start and end
  const blockMap = contentState.getBlockMap();
  const startBlock = contentState.getBlockForKey(startKey);
  const endBlock = contentState.getBlockForKey(endKey);

  // Calculate length of selected text in start and end blocks
  const startBlockLength = startBlock.getText().length - startOffset;
  const endBlockLength = endOffset;

  // Find all blocks in between and sum their lengths
  let middleBlocksLength = 0;
  let inSelection = false;

  blockMap.forEach((block) => {
    const key = block?.getKey();

    if (key === startKey) {
      inSelection = true;
    } else if (inSelection && key !== endKey && block) {
      middleBlocksLength += block.getText().length;
    } else if (key === endKey) {
      inSelection = false;
    }
  });

  // Sum all parts
  return startBlockLength + middleBlocksLength + endBlockLength;
};
