import React, { useRef } from "react";
import { useMediaQuery } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ReactComponent as EditIcon } from "app/modules/home-module/assets/edit.svg";
import { ReactComponent as DuplicateIcon } from "app/modules/home-module/assets/duplicate.svg";
import { ReactComponent as DeleteIcon } from "app/modules/home-module/assets/delete.svg";
import { ReactComponent as ShareIcon } from "app/modules/home-module/assets/share-icon.svg";

import { useAuth0 } from "@auth0/auth0-react";
import { MOBILE_BREAKPOINT } from "app/theme";
import ShareModal from "./shareModal";

export default function MenuItems(props: {
  handleClose: () => void;
  owner: string;
  id: string;
  path: string;
  handleDuplicate: (id: string, type?: string) => void;
  handleDelete: (id: string) => void;
  type: "chart" | "dataset" | "story";
  top?: string;
  right?: string;
  display?: boolean;
}) {
  const { user, isAuthenticated } = useAuth0();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`);
  const canEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);
  const menuRef = useRef<HTMLDivElement>(null);
  const [alignLeft, setAlignLeft] = React.useState(false);
  const [displayShareModal, setDisplayShareModal] = React.useState(false);
  const disabledStyle = "opacity: 0.5;pointer-events: none;";
  const menuItems = [
    {
      label: "Duplicate",
      icon: <DuplicateIcon />,
      action: () => props.handleDuplicate(props.id),
      disabled: !isAuthenticated,
    },
    {
      label: "Edit",
      icon: (
        <EditIcon
          css={`
            margin-top: 4px;
          `}
        />
      ),
      action: () => {},
      disabled: !canEditDelete,
    },
    {
      label: "Delete",
      icon: <DeleteIcon />,
      action: () => props.handleDelete(props.id),
      disabled: !canEditDelete,
    },
    {
      label: "Share",
      icon: <ShareIcon />,
      action: () => {
        setDisplayShareModal(true);
        // props.handleClose();
      },
      disabled: !isAuthenticated,
    },
  ];

  React.useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    if (rect.right > window.innerWidth) {
      setAlignLeft(true);
    } else {
      setAlignLeft(false);
    }
  }, [props.top, props.right, menuItems.length]);

  React.useEffect(() => {
    const handleResize = () => {
      const el = menuRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      setAlignLeft(rect.right > window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <React.Fragment>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setDisplayShareModal(false);
          props.handleClose();
        }}
        data-testid={`${props.type}-grid-item-menu-overlay`}
        css={`
          top: 0;
          left: 0;
          z-index: 1;
          width: 100vw;
          height: 100vh;
          position: fixed;
          display: ${props.display ? "block" : "none"};
        `}
      />
      <div
        css={`
          top: ${props.top ?? "38px"};
          right: ${props.right ?? "-39%"};
          ${displayShareModal ? "left: 92%; right: auto;" : ""}
          transform: translateX(${alignLeft ? "-90%" : "0%"});
          transition: transform 0.2s ease-in-out;
          height: ${props.display ? "auto" : "0"};
          opacity: ${props.display ? "1" : "0"};
          overflow: ${props.display ? "visible" : "hidden"};
          transition: all 0.2s ease-in-out;
          z-index: 2;
          position: absolute;
        `}
      >
        {displayShareModal ? (
          <ShareModal
            setDisplayShareModal={setDisplayShareModal}
            assetURL={`https://${window.location.hostname}/${props.type}/${props.id}`}
          />
        ) : (
          <div
            ref={menuRef}
            css={`
              gap: 1rem;
              width: 147px;
              background: #f1f3f5;
              border-radius: 10px;
              box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.3);
              span {
                color: #231d2c;
                white-space: nowrap;
                font-family: "GothamNarrow-book", "Helvetica Neue", sans-serif;
                font-size: 14px;
              }
              div {
                padding: 0 16px;
                :hover {
                  background: #dfe3e5;
                  cursor: pointer;
                }
              }
              button,
              a {
                background: transparent;
                outline: none;
                display: flex;
                padding: 11px 0px;
                align-items: center;
                gap: 16px;
                border: none;
                border-bottom: 1px solid #cfd4da;
                cursor: pointer;
                text-decoration: none;
                width: 100%;

                svg {
                  flex-shrink: 0;
                }
              }
            `}
          >
            {menuItems.map((item, index) =>
              item.label === "Edit" ? (
                <>
                  {!isMobile && (
                    <div key={item.label}>
                      <Link
                        to={props.path}
                        aria-label={`${item.label.toLowerCase()}-icon`}
                        data-cy={`${
                          props.type
                        }-grid-item-${item.label.toLowerCase()}-btn`}
                        css={`
                          ${index === menuItems.length - 1
                            ? "border-bottom: none;"
                            : ""}
                        `}
                      >
                        <EditIcon
                          css={`
                            margin-top: 4px;
                          `}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div
                  css={`
                    ${item.label === "Duplicate"
                      ? "border-radius: 10px 10px 0 0;"
                      : ""};
                    ${item.label === "Share"
                      ? "border-radius:0 0 10px 10px ;"
                      : ""}
                  `}
                >
                  <button
                    key={item.label}
                    onClick={item.action}
                    data-cy={`${
                      props.type
                    }-grid-item-${item.label.toLowerCase()}-btn`}
                    aria-label={`${
                      props.type
                    }-${item.label.toLowerCase()}-button`}
                    css={
                      item.label === "Share"
                        ? "border-bottom: none !important;"
                        : "" + (item.disabled ? disabledStyle : "")
                    }
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
