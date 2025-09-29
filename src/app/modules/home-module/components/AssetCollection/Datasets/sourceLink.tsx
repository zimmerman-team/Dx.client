import { isEmpty } from "lodash";
import React from "react";

interface SourceLinkProps {
  source: string;
  sourceURL: string;
}

export default function SourceLink(props: SourceLinkProps) {
  return (
    <>
      {isEmpty(props.sourceURL) ? (
        <div
          css={`
            display: flex;
            align-items: center;
            gap: 5px;
            color: #343330;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            font-size: 12px;
            font-weight: 325;
            line-height: normal;
            text-transform: capitalize;
          `}
        >
          {props.source}
        </div>
      ) : (
        <div
          css={`
            display: flex;
            align-items: flex-end;
            gap: 5px;
            a {
              color: #231d2c;
              font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
              font-size: 12px;
              font-weight: 325;
              line-height: normal;
              text-decoration-line: underline;
              text-decoration-style: solid;
              text-underline-position: from-font;
              display: inline-block;
              max-width: 80px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          `}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.26825 9.12491L8.39414 2.99955L3.85718 2.99955C3.74351 2.99955 3.6345 2.9544 3.55413 2.87403C3.47376 2.79365 3.42861 2.68465 3.42861 2.57098C3.42861 2.45732 3.47376 2.34831 3.55413 2.26793C3.6345 2.18756 3.74351 2.14241 3.85718 2.14241L9.42861 2.14241C9.54227 2.14241 9.65128 2.18756 9.73165 2.26793C9.81202 2.34831 9.85718 2.45732 9.85718 2.57098L9.85718 8.14241C9.85718 8.25607 9.81202 8.36508 9.73165 8.44546C9.65128 8.52583 9.54227 8.57098 9.42861 8.57098C9.31494 8.57098 9.20593 8.52583 9.12556 8.44546C9.04519 8.36508 9.00003 8.25607 9.00003 8.14241L9.00003 3.60544L2.87468 9.73134C2.83486 9.77116 2.78759 9.80274 2.73556 9.82429C2.68354 9.84584 2.62778 9.85693 2.57146 9.85693C2.51515 9.85693 2.45939 9.84584 2.40736 9.82429C2.35534 9.80274 2.30807 9.77116 2.26825 9.73134C2.22843 9.69152 2.19684 9.64425 2.17529 9.59222C2.15375 9.5402 2.14265 9.48444 2.14265 9.42812C2.14265 9.37181 2.15375 9.31605 2.17529 9.26403C2.19684 9.212 2.22843 9.16473 2.26825 9.12491Z"
              fill="#343330"
            />
          </svg>

          <a
            title={props.source}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.stopPropagation();
            }}
            href={props.sourceURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {props.source}
          </a>
        </div>
      )}
    </>
  );
}
