import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import SaveAlt from "@material-ui/icons/SaveAlt";
import IconButton from "@material-ui/core/IconButton";
import {
  StyledMenu,
  StyledMenuItem,
} from "app/modules/chart-module/components/exporter";
import { Link, useParams } from "react-router-dom";

export function ExportStoryButton(props: { filename: string }) {
  const { page } = useParams<{
    page: string;
  }>();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);

  const firstMenuItemRef = React.useRef<HTMLLIElement>(null);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  React.useEffect(() => {
    if (open && firstMenuItemRef.current) {
      setTimeout(() => {
        firstMenuItemRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.currentTarget.querySelector("a")?.click();
    }
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        aria-label="export-button"
        data-cy="export-report"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "export-menu" : undefined}
      >
        <Tooltip title="Export">
          <SaveAlt htmlColor="#262c34" />
        </Tooltip>
      </IconButton>
      <StyledMenu
        keepMounted
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        id="export-menu"
      >
        <StyledMenuItem
          ref={firstMenuItemRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          <Link
            target="_blank"
            to={`/story/${page}/downloaded-view?type=pdf&filename=${props.filename}`}
            data-cy="export-report-pdf"
            css={`
              text-decoration: none;
              width: 100%;
              height: 100%;
            `}
            aria-label="Export as PDF"
            rel="noopener noreferrer"
          >
            .pdf
          </Link>
        </StyledMenuItem>
        <StyledMenuItem tabIndex={0} onKeyDown={handleKeyDown}>
          <Link
            target="_blank"
            to={`/story/${page}/downloaded-view?type=png&filename=${props.filename}`}
            data-cy="export-report-png"
            css={`
              text-decoration: none;
              width: 100%;
              height: 100%;
            `}
            aria-label="Export as PNG"
            rel="noopener noreferrer"
          >
            .png
          </Link>
        </StyledMenuItem>

        <StyledMenuItem tabIndex={0} onKeyDown={handleKeyDown}>
          <Link
            target="_blank"
            to={`/story/${page}/downloaded-view?type=svg&filename=${props.filename}`}
            data-cy="export-report-svg"
            css={`
              text-decoration: none;
              width: 100%;
              height: 100%;
            `}
            aria-label="Export as SVG"
            rel="noopener noreferrer"
          >
            .svg
          </Link>
        </StyledMenuItem>
      </StyledMenu>
    </>
  );
}
