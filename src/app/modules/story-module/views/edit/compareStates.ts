import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import _ from "lodash";
import { ContentBlock, ContentState, EditorState } from "draft-js";

/**
 * Compares two EditorState instances for content and style equality
 * @param editorState1 First EditorState to compare
 * @param editorState2 Second EditorState to compare
 * @returns boolean indicating if the editor states are equal
 */
export const compareEditorStates = (
  editorState1: EditorState,
  editorState2: EditorState
  // eslint-disable-next-line sonarjs/cognitive-complexity
): boolean => {
  if (!editorState1 || !editorState2) {
    return editorState1 === editorState2;
  }

  const content1 = editorState1.getCurrentContent();
  const content2 = editorState2.getCurrentContent();

  // Compare plain text first as a quick check
  if (content1.getPlainText() !== content2.getPlainText()) {
    return false;
  }

  // Compare block keys and data
  const blocks1 = content1.getBlockMap().toArray();
  const blocks2 = content2.getBlockMap().toArray();

  if (blocks1.length !== blocks2.length) {
    return false;
  }

  // Compare each block's text, type, depth, data, and inline styles
  for (let i = 0; i < blocks1.length; i++) {
    const block1: ContentBlock = blocks1[i];
    const block2: ContentBlock = blocks2[i];

    // Compare block type and depth
    if (
      block1.getType() !== block2.getType() ||
      block1.getDepth() !== block2.getDepth()
    ) {
      return false;
    }

    // Compare block data
    if (!_.isEqual(block1.getData().toObject(), block2.getData().toObject())) {
      return false;
    }

    // Compare inline styles for each character
    const text1 = block1.getText();
    const text2 = block2.getText();

    if (text1 !== text2) {
      return false;
    }

    for (let j = 0; j < text1.length; j++) {
      const styles1 = block1.getInlineStyleAt(j).toArray();
      const styles2 = block2.getInlineStyleAt(j).toArray();

      if (!_.isEqual(styles1.sort(), styles2.sort())) {
        return false;
      }
    }

    // Compare entity data at each character position
    for (let j = 0; j < text1.length; j++) {
      const entityKey1 = block1.getEntityAt(j);
      const entityKey2 = block2.getEntityAt(j);

      if (entityKey1 !== entityKey2) {
        return false;
      }

      if (entityKey1) {
        const entity1 = content1.getEntity(entityKey1);
        const entity2 = content2.getEntity(entityKey2);

        if (
          entity1.getType() !== entity2.getType() ||
          !_.isEqual(entity1.getData(), entity2.getData())
        ) {
          return false;
        }
      }
    }
  }

  return true;
};

/**
 * Enhanced comparison of header details that checks for style changes as well as content
 * @param headerDetailsProps Header details from props
 * @param headerDetailsState Header details from state
 * @returns boolean indicating if the header details are equal
 */
export const compareHeaderDetailsState = (
  headerDetailsProps: IHeaderDetails,
  headerDetailsState: IHeaderDetails
): boolean => {
  // Check if the keys are the same
  const propsKeys = Object.keys(headerDetailsProps);
  const stateKeys = Object.keys(headerDetailsState);

  if (propsKeys.length !== stateKeys.length) {
    return false;
  }

  // Check if all keys in headerDetailsProps are present in headerDetailsState
  for (const key of propsKeys) {
    if (!stateKeys.includes(key)) {
      return false;
    }
  }

  // Check if all values are the same
  for (const key of propsKeys) {
    if (key === "description" || key === "heading") {
      // Enhanced editor state comparison that checks for styles
      if (
        !compareEditorStates(headerDetailsProps[key], headerDetailsState[key])
      ) {
        return false;
      }
    } else {
      if (
        !_.isEqual(
          headerDetailsProps[key as keyof typeof headerDetailsProps],
          headerDetailsState[key as keyof typeof headerDetailsState]
        )
      ) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Deep comparison of content item arrays with style checking
 * @param content1 First content array to compare
 * @param content2 Second content array to compare
 * @returns boolean indicating if the content arrays are equal
 */
export const compareContentArrays = (
  content1: any[],
  content2: any[]
): boolean => {
  if (content1.length !== content2.length) {
    return false;
  }

  for (let i = 0; i < content1.length; i++) {
    const item1 = content1[i];
    const item2 = content2[i];

    if (item1 instanceof EditorState && item2 instanceof EditorState) {
      if (!compareEditorStates(item1, item2)) {
        return false;
      }
    } else if (_.isObject(item1) && _.isObject(item2)) {
      // Deep compare objects
      if (!_.isEqual(item1, item2)) {
        return false;
      }
    } else {
      // Simple equality for primitives
      if (item1 !== item2) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Enhanced comparison of frames arrays that checks for style changes and deep equality
 * @param framesArrayProps Frames array from props
 * @param framesArrayState Frames array from state
 * @returns boolean indicating if the frames arrays are equal
 */
export const compareFramesArrayState = (
  framesArrayProps: IFramesArray[],
  framesArrayState: IFramesArray[]
  // eslint-disable-next-line sonarjs/cognitive-complexity
): boolean => {
  if (framesArrayProps.length !== framesArrayState.length) {
    return false;
  }

  // Properties to omit when comparing frames

  for (let i = 0; i < framesArrayProps.length; i++) {
    const itemProps = _.omit(
      framesArrayProps[i],
      "id",
      "frame.rowId",
      "frame.handlePersistStoryState",
      "frame.handleRowFrameItemResize",
      "frame.previewItems"
    );
    const itemState = _.omit(
      framesArrayState[i],
      "id",
      "frame.rowId",
      "frame.handlePersistStoryState",
      "frame.handleRowFrameItemResize",
      "frame.previewItems"
    );

    const itemPropsKeys = Object.keys(itemProps);
    const itemStateKeys = Object.keys(itemState);

    if (itemPropsKeys.length !== itemStateKeys.length) {
      return false;
    }

    // Check if all keys in itemPropsKeys are in itemStateKeys
    for (const key of itemPropsKeys) {
      if (!itemStateKeys.includes(key)) {
        return false;
      }
    }

    // Check if all values are the same
    for (const key of itemPropsKeys) {
      if (key === "content") {
        if (!compareContentArrays(itemProps.content, itemState.content)) {
          return false;
        }
      } else if (key === "frame") {
        // Deep compare nested frame objects
        const frameProps = itemProps.frame;
        const frameState = itemState.frame;

        if (!_.isEqual(frameProps, frameState)) {
          return false;
        }
      } else {
        if (
          !_.isEqual(
            itemProps[key as keyof typeof itemProps],
            itemState[key as keyof typeof itemState]
          )
        ) {
          return false;
        }
      }
    }
  }

  return true;
};
