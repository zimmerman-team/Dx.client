import { CompositeDecorator } from "draft-js";
import { LinkDecorator, linkStrategy } from "./linkDecorator";

export const decorators = () =>
  new CompositeDecorator([
    {
      strategy: linkStrategy,
      component: LinkDecorator,
    },
  ]);
