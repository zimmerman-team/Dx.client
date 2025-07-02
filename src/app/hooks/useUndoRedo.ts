import React from "react";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { Updater } from "use-immer";

export function useUndoRedo<T>(
  framesArray: IFramesArray[],
  updateFramesArray: Updater<IFramesArray[]>,
  undoStack: IFramesArray[][],
  setUndoStack: React.Dispatch<React.SetStateAction<IFramesArray[][]>>,
  redoStack: IFramesArray[][],
  setRedoStack: React.Dispatch<React.SetStateAction<IFramesArray[][]>>
): {
  undo(): void;
  redo(): void;
  store(): void;
} {
  const store = () => {
    console.log(framesArray, "framesArray added");
    setUndoStack((prev) => [...prev, framesArray]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length > 1) {
      const last = undoStack[undoStack.length - 1];
      // const desired = undoStack[undoStack.length - 2];
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
      setRedoStack([...redoStack, last]);
      updateFramesArray(last);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const last = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, last]);
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      updateFramesArray(last);
    }
  };

  return { undo, redo, store };
}
