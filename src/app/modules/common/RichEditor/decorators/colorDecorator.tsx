import { ContentBlock, ContentState } from "draft-js";
import { Decorator } from ".";

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
  console.log("Rendering color decorator with color:", color); // Debug log
  return <span style={{ color: color }}>{children}</span>;
}
