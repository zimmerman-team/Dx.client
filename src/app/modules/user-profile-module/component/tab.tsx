import React from "react";
import { tabcss } from "@app/modules/user-profile-module/style";

interface TabProps {
  title: string;
  active: boolean;
  handleClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  component: () => JSX.Element;
  disabled: boolean;
  dataCy?: string;
}

export default function Tab(props: TabProps) {
  return (
    <button
      onClick={props.handleClick}
      css={tabcss(props.active, props.disabled)}
      data-cy={props.dataCy}
    >
      <p>{props.title}</p>
      <div
        css={`
          line-height: 0;
        `}
      >
        {props.component()}
      </div>
    </button>
  );
}
