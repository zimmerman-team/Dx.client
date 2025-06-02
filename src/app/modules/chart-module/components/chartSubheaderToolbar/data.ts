import { IFramesArray } from "app/modules/story-module/views/create/data";
import { IHeaderDetails } from "app/modules/story-module/components/right-panel/data";
import { ToolbarPluginsType } from "app/modules/story-module/components/storySubHeaderToolbar/staticToolbar";

export interface ChartSubheaderToolbarProps {
  name: string;
  isAiSwitchActive: boolean;
  visualOptions?: any;
  dimensions: any;
  isMappingValid: boolean;
  setName: (name: string) => void;
  setHasSubHeaderTitleFocused?: (value: boolean) => void;
  setHasSubHeaderTitleBlurred?: (value: boolean) => void;
  setStopInitializeFramesWidth?: (value: boolean) => void;
  isPreviewView: boolean;
  setAutoSaveState: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
      enableAutoSaveSwitch: boolean;
    }>
  >;
  autoSave: boolean;
  onSave: () => void;
  enableAutoSaveSwitch: boolean;
  savedChanges: boolean;
  onSetIsPublic?: (isPublic: boolean) => void;
}

export interface StorySubheaderToolbarProps {
  name: string;
  autoSave: boolean;
  setAutoSave: React.Dispatch<
    React.SetStateAction<{
      isAutoSaveEnabled: boolean;
    }>
  >;
  visualOptions?: any;
  onStorySave: (type: "create" | "edit") => Promise<void>;
  setName: (name: string) => void;
  isSaveEnabled?: boolean;
  rawViz?: any;
  setHasStoryNameFocused?: (value: boolean) => void;
  setHasStoryNameBlurred?: (value: boolean) => void;
  plugins: ToolbarPluginsType;
  headerDetails: IHeaderDetails;
  framesArray: IFramesArray[];
  setStopInitializeFramesWidth?: (value: boolean) => void;
  handlePersistStoryState?: () => void;
  isPreviewView: boolean;
  onSetIsPublic?: (isPublic: boolean) => void;
}
