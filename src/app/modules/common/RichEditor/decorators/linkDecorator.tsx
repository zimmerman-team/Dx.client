import React from "react";
import { CompositeDecorator, ContentBlock, ContentState } from "draft-js";

type Decorator = {
  contentState: ContentState;
  entityKey: string;
  children: string;
};

export function linkStrategy(
  block: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  block.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
}

export const LinkDecorator = ({
  contentState,
  entityKey,
  children,
  ...props
}: Decorator) => {
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <a
      css={`
        color: #6061e5;
      `}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
