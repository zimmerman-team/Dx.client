import React from "react";
import { ReactComponent as Icon } from "app/modules/chart-module/assets/ai-icon.svg";
import { Tooltip } from "react-tooltip";

export default function AIIcon() {
  return (
    <>
      <Icon
        data-cy="chart-grid-item-ai-icon"
        data-testid="chart-grid-item-ai-icon"
        className="AIChart-info"
        css={`
          cursor: pointer;
          margin: 0;
          line-height: normal;
          flex-shrink: 0;
        `}
      />

      <Tooltip
        anchorSelect=".AIChart-info"
        place="bottom"
        style={{
          background: "#231D2C",
          borderRadius: "8px",
          color: "#fff",
          fontSize: "12px",
          fontFamily: "GothamNarrow-Medium, 'Helvetica Neue', sans-serif",
          width: "320px",
          lineHeight: "16px",
          zIndex: 100,
        }}
      >
        Based on the dataset selected, a recommendation for this chart was
        offered by our AI assistant.
      </Tooltip>
    </>
  );
}
