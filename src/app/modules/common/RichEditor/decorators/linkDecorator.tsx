import React from "react";
import { ContentBlock, ContentState } from "draft-js";
import { Decorator } from "./types";

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
        text-decoration: underline;
      `}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};

export function colorStrategy(
  block: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) {
  block.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "COLOR"
    );
  }, callback);
}

export function colorDecorator({
  contentState,
  entityKey,
  children,
}: Decorator) {
  const { color } = contentState.getEntity(entityKey).getData();
  return <span style={{ color: color }}>{children}</span>;
}
