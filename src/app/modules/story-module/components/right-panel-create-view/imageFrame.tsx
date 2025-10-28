import React from "react";
import { useDrag } from "react-dnd";
import { css } from "styled-components";

export default function ImageFrame(props: {
  imageId: string;
  imageUrl: string;
  source: "shutterstock" | "unsplash";
  thumbnail: string;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "image",
    item: {
      type: "image",
      value: props,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      css={css`
        height: 173.25px;
        position: relative;
        cursor: grab;
        ${isDragging && "cursor: grabbing;"}
        background-image: ${`url(${props.thumbnail})`};
        background-position: top left;
        background-repeat: no-repeat;
        background-size: cover;
      `}
      ref={drag}
      data-cy="image-frame"
    ></div>
  );
}
