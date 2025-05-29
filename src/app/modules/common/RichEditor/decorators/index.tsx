import { CompositeDecorator, ContentState, EditorState } from "draft-js";
import {
  LinkDecorator,
  linkStrategy,
  colorDecorator,
  colorStrategy,
} from "./linkDecorator";
// import { colorDecorator, colorStrategy } from "./colorDecorator";

export const decorators = () =>
  new CompositeDecorator(
    [
      {
        strategy: colorStrategy,
        component: colorDecorator,
      },
      // {
      //   strategy: linkStrategy,
      //   component: LinkDecorator,
      // },
    ] // Easy to add more decorators here
  );
// export const decorators = new CompositeDecorator(decoratorConfigs);

export const addColorDecorator = (editorState: EditorState): EditorState => {
  const currentDecorator = editorState.getDecorator();

  // For now, always set the color decorator
  // If you have other decorators, you'll need to manage them in a combined decorator
  return EditorState.set(editorState, {
    decorator: decorators,
  });
};
