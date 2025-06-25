import { IFramesArray } from "app/modules/story-module/views/create/data";
import { Updater } from "use-immer";

export const usehandleRowFrameItemResize = (
  updateFramesArray: Updater<IFramesArray[]>
) => {
  const handleRowFrameItemResize = (
    rowId: string,
    itemIndex: number,
    width: number,
    height: number
  ) => {
    updateFramesArray((draft) => {
      const frameIndex = draft.findIndex((frame) => frame.id === rowId);
      if (frameIndex === -1) return draft;

      const contentContainer = document.getElementById("content-container");
      if (!contentContainer) return draft;

      // Total container width
      const containerWidth = contentContainer.offsetWidth;

      // Calculate new width as percentage of available content space

      const percentage = (width / containerWidth) * 100;

      // Store original width before change
      const originalWidth = draft[frameIndex].contentWidths[itemIndex];

      // Calculate width delta (change)
      const widthDelta = percentage - originalWidth;

      // Apply minimum width constraint (as percentage)
      const minWidthPx = 78; // minimum width in pixels
      const minWidthPercentage = (minWidthPx / containerWidth) * 100;

      // Find the neighbor to affect (next item or previous if last)
      const neighborIndex =
        itemIndex < draft[frameIndex].content.length - 1
          ? itemIndex + 1
          : itemIndex - 1;

      // Calculate new neighbor width
      const neighborNewWidth =
        draft[frameIndex].contentWidths[neighborIndex] - widthDelta;

      // Check if both new widths respect minimum width
      if (
        percentage >= minWidthPercentage &&
        neighborNewWidth >= minWidthPercentage
      ) {
        // Apply new width to current item
        draft[frameIndex].contentWidths[itemIndex] = percentage;

        // Apply adjusted width to neighbor only
        draft[frameIndex].contentWidths[neighborIndex] = neighborNewWidth;
      }
      if (!draft[frameIndex].contentHeights) {
        draft[frameIndex].contentHeights = [];
      }

      draft[frameIndex].contentHeights.forEach((_, index) => {
        draft[frameIndex].contentHeights[index] = height;
      });
    });
  };

  const handleRowHeightResize = (rowId: string, height: number) => {
    updateFramesArray((draft) => {
      const frameIndex = draft.findIndex((frame) => frame.id === rowId);
      if (frameIndex === -1) {
        return draft;
      }

      if (!draft[frameIndex].contentHeights) {
        draft[frameIndex].contentHeights = [];
      }

      draft[frameIndex].contentHeights.forEach((_, index) => {
        draft[frameIndex].contentHeights[index] = height;
      });
    });
  };

  return { handleRowFrameItemResize, handleRowHeightResize };
};
