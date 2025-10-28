import React, { useState } from "react";
import { ReactComponent as YoutubeIcon } from "app/modules/story-module/asset/youtube-icon.svg";
import { css } from "styled-components";
import { useDrag } from "react-dnd";
import YoutubeGradient from "app/modules/story-module/asset/youtube-gradient.png";

export default function VideoFrame(props: {
  videoId: string;
  embedUrl: string;
  snippet: any;
  source: "youtube";
  thumbnail: string;
  title: string;
  description: string;
  ownerThumbnail: string;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "video",
    item: {
      type: "video",
      value: props,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [play, setPlay] = useState(false);

  return (
    <div
      css={css`
        height: 173.25px;
        position: relative;
        cursor: grab;
        ${isDragging && "cursor: grabbing;"}
        background-image: ${`url(${YoutubeGradient}),url(${props.thumbnail})`};
        background-position: top left, top left;
        background-repeat: no-repeat, no-repeat;
        background-size: contain, cover;
      `}
      ref={drag}
      onClick={() => setPlay(!play)}
      data-cy="video-frame"
    >
      {play ? (
        <>
          {" "}
          <iframe
            title="video player"
            src={props.embedUrl + "?autoplay=1"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            css={css`
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              border: none;
              box-shadow: none;
              pointer-events: none;
            `}
          ></iframe>{" "}
          <div
            css={css`
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            `}
          ></div>
        </>
      ) : (
        <div
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
          `}
        >
          <div
            css={css`
              position: absolute;
              top: 7.11px;
              left: 7.11px;
              display: flex;
              column-gap: 6px;
            `}
          >
            <div
              css={css`
                width: 24px;
                height: 24px;
                border-radius: 9999px;
                overflow: hidden;
              `}
            >
              <img
                src={props.ownerThumbnail}
                alt="thumb"
                css={css`
                  height: 100%;
                  width: 100%;
                  object-fit: cover;
                `}
              />
            </div>
            <div
              css={css`
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 250px;
                color: white;
                font-size: 10.662px;
                font-family: Roboto;
              `}
              dangerouslySetInnerHTML={{ __html: props.title }}
            ></div>
          </div>
          <div
            css={`
              cursor: pointer;
            `}
          >
            <YoutubeIcon />
          </div>
        </div>
      )}
    </div>
  );
}
