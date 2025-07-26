import React from "react";
import { IFramesArray } from "app/modules/story-module/views/create/data";
import { Updater } from "use-immer";

interface NavigatorUAData {
  platform: string;
}

interface ExtendedNavigator extends Navigator {
  userAgentData?: NavigatorUAData;
}

function isMacOS(): boolean {
  // Modern browsers
  //@ts-ignore
  if (navigator.userAgentData) {
    //@ts-ignore
    return navigator.userAgentData.platform === "macOS";
  }

  // Fallback for older browsers
  return navigator.userAgent.toUpperCase().indexOf("MAC") >= 0;
}

const isMac = isMacOS();
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
  store: (modifiedFramesArray?: IFramesArray[]) => void;
} {
  const store = (modifiedFramesArray?: IFramesArray[]) => {
    if (modifiedFramesArray) {
      setUndoStack((prev) => [...prev, modifiedFramesArray]);
    } else {
      setUndoStack((prev) => [...prev, framesArray]);
    }
    setRedoStack([]);
  };
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      if (ctrlOrCmd && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undo();
      } else if (ctrlOrCmd && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undoStack, redoStack, framesArray]);

  const undo = () => {
    if (undoStack.length > 1) {
      const last = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, framesArray]);
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
      updateFramesArray(last);
    }
  };

  const redo = () => {
    if (redoStack.length > 0) {
      const last = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, framesArray]);
      setRedoStack(redoStack.slice(0, redoStack.length - 1));
      updateFramesArray(last);
    }
  };

  return { undo, redo, store };
}
