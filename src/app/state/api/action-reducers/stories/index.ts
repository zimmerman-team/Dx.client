import { APIModel } from "@app/state/api";
import { ApiCallModel } from "@app/state/api/interfaces";

export const StoryGet: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/story`),
};

export const StoryCreate: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/story`),
};

export const StoryUpdate: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/story`),
};

export const StoryDelete: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/story`),
};

export const StoryDuplicate: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/story/duplicate`),
};

export const StoryGetList: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/stories`),
};

export const StoriesCount: ApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_API}/stories/count`),
};
