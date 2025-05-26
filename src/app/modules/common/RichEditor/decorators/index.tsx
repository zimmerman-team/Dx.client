import { CompositeDecorator, ContentState, EditorState } from "draft-js";
import { LinkDecorator, linkStrategy } from "./linkDecorator";
import { colorDecorator, colorStrategy } from "./colorDecorator";

export type Decorator = {
  contentState: ContentState;
  entityKey: string;
  children: React.ReactNode;
};

export const Decorators = () =>
  new CompositeDecorator([
    {
      strategy: colorStrategy,
      component: colorDecorator,
    },
    // {
    //   strategy: linkStrategy,
    //   component: LinkDecorator,
    // },
  ]);

export const addColorDecorator = (editorState: EditorState): EditorState => {
  const currentDecorator = editorState.getDecorator();

  // For now, always set the color decorator
  // If you have other decorators, you'll need to manage them in a combined decorator
  return EditorState.set(editorState, {
    decorator: Decorators(),
  });
};
