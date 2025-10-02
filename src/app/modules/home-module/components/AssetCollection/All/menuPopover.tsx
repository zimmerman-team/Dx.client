import React, { useRef } from "react";
import { Popover, useMediaQuery } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ReactComponent as EditIcon } from "app/modules/home-module/assets/edit.svg";
import { ReactComponent as DuplicateIcon } from "app/modules/home-module/assets/duplicate.svg";
import { ReactComponent as DeleteIcon } from "app/modules/home-module/assets/delete.svg";
import { ReactComponent as ShareIcon } from "app/modules/home-module/assets/share-icon.svg";
import { ReactComponent as MenuIcon } from "app/modules/home-module/assets/menu.svg";
import { useAuth0 } from "@auth0/auth0-react";
import { FOCUS_VISIBLE_STYLE_LIGHT, MOBILE_BREAKPOINT } from "app/theme";
import ShareModal from "./shareModal";
import { useMenuNavigation } from "app/hooks/useMenuNavigation";

type Position = "top" | "bottom" | "center";
export default function MenuPopover(props: {
  owner: string;
  id: string;
  menuId: string;
  path: string;
  handleDuplicate: (id: string, type?: string) => void;
  handleDelete: (id: string) => void;
  type: "chart" | "dataset" | "story";
  dataCy: string;
  dataTestId: string;
  left?: string;
}) {
  const { user, isAuthenticated } = useAuth0();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT})`);
  const canEditDelete = React.useMemo(() => {
    return isAuthenticated && props.owner === user?.sub;
  }, [user, isAuthenticated]);
  const menuRef = useRef<HTMLDivElement>(null);
  const [displayShareModal, setDisplayShareModal] = React.useState(false);

  function getButtonStyles(item: any, position: Position) {
    const styles = [];
    if (item.disabled)
      styles.push(`
      opacity: 0.5;pointer-events: none;
      &:focus-visible {
                      border: 2px solid #00b5d8;}
    `);
    if (position === "top") {
      styles.push(`border-radius: 16px 16px 0 0;  &:focus-visible {
                      border: 2px solid #00b5d8;
                           border-top-left-radius: 16px;
                  border-top-right-radius: 16px;}
                    
    `);
    } else if (position === "center") {
      styles.push(`&:focus-visible {
                      border: 2px solid #00b5d8;
                  }`);
    } else {
      styles.push(
        `border-radius:0 0 16px 16px; border-bottom: none !important; &:focus-visible {
                      border: 2px solid #00b5d8 !important;
                           border-bottom-left-radius: 16px;
                  border-bottom-right-radius: 16px;}`
      );
    }

    return styles.join("\n");
  }

  function renderEditItem(
    item: any,
    index: number,
    activeIndex: number | null,
    itemRefs: React.MutableRefObject<(HTMLElement | null)[]>,
    type: string,
    isMobile: boolean
  ) {
    if (isMobile) return null;

    return (
      <Link
        ref={(el) => (itemRefs.current[index] = el)}
        key={item.label}
        tabIndex={activeIndex === index ? 0 : -1}
        role="menuitem"
        to={props.path}
        aria-label={`${item.label.toLowerCase()}-icon`}
        data-cy={`${type}-grid-item-${item.label.toLowerCase()}-btn`}
        css={`
          ${index === menuItems.length - 1 ? "border-bottom: none;" : ""}
          :focus-visible {
            border: 2px solid #00b5d8;
            ${index === 0
              ? "border-top-left-radius: 16px; border-top-right-radius: 16px;"
              : ""}
            ${index === menuItems.length - 1
              ? "border-bottom-left-radius: 16px; border-bottom-right-radius: 16px;"
              : ""}
          }
        `}
      >
        <EditIcon
          css={`
            margin-top: 4px;
          `}
        />
        <span>{item.label}</span>
      </Link>
    );
  }

  function renderButtonItem(
    item: any,
    index: number,
    itemsLength: number,
    activeIndex: number | null,
    itemRefs: React.MutableRefObject<(HTMLElement | null)[]>,
    type: string,
    closeMenu: () => void
  ) {
    const position =
      index === 0 ? "top" : index === itemsLength - 1 ? "bottom" : "center";
    return (
      <button
        ref={(el) => (itemRefs.current[index] = el)}
        key={item.label}
        tabIndex={activeIndex === index ? 0 : -1}
        role="menuitem"
        onClick={() => {
          item.action();
          if (item.label !== "Share") {
            closeMenu();
          }
        }}
        data-cy={`${type}-grid-item-${item.label.toLowerCase()}-btn`}
        aria-label={`${type}-${item.label.toLowerCase()}-button`}
        css={`
          ${getButtonStyles(item, position)}
        `}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    );
  }

  const menuItems = [
    {
      label: "Duplicate",
      icon: <DuplicateIcon />,
      action: () => {
        props.handleDuplicate(props.id);
      },
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
      action: () => {
        props.handleDelete(props.id);
      },
      disabled: !canEditDelete,
    },
    {
      label: "Share",
      icon: <ShareIcon />,
      action: () => {
        setDisplayShareModal(true);
      },
      disabled: !isAuthenticated,
    },
  ];
  const {
    openState,
    setOpenState,
    triggerRef,
    itemRefs,
    handleTriggerKeyDown,
    handleMenuKeyDown,
    activeIndex,
    closeMenu,
  } = useMenuNavigation({
    items: menuItems,
  });
  const handleClosePopover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenState(null);
  };
  const togglePopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    setOpenState(openState ? null : event.currentTarget);
  };

  return (
    <React.Fragment>
      <button
        css={`
          border: none;
          background: ${openState ? "#CFD0F4" : "transparent"};
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          height: 19px;
          width: 19px;
          border-radius: 5px;
          right: 5px;
          top: 12px;
          cursor: pointer;
          &:focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
          svg {
            flex-shrink: 0;
          }
          &:hover {
            background: transparent;
          }
        `}
        onKeyDown={(e) => handleTriggerKeyDown(e, e.currentTarget)}
        ref={triggerRef}
        onClick={togglePopover}
        data-cy={props.dataCy}
        data-testid={props.dataTestId}
        aria-label="data menu-button"
        aria-haspopup="menu"
        aria-expanded={!!openState}
      >
        <MenuIcon />
      </button>
      <Popover
        open={!!openState}
        anchorEl={openState}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        css={`
          .MuiPaper-root {
            border-radius: 16px;
            height: auto;
            width: max-content;
          }
        `}
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          onKeyDown={handleMenuKeyDown}
          role="menu"
          css={`
            ${displayShareModal
              ? `left:${props.left || "92%"}; right: auto;`
              : ""}
            height: auto;
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

                button,
                a {
                  background: transparent;
                  outline: none;
                  display: flex;
                  padding: 11px 16px;
                  align-items: center;
                  gap: 16px;
                  border: none;
                  border-bottom: 1px solid #cfd4da;
                  cursor: pointer;
                  text-decoration: none;
                  width: 100%;
                  :hover {
                    background: #dfe3e5;
                    cursor: pointer;
                  }

                  svg {
                    flex-shrink: 0;
                  }
                }
              `}
            >
              {menuItems.map((item, index) =>
                item.label === "Edit"
                  ? renderEditItem(
                      item,
                      index,
                      activeIndex,
                      itemRefs,
                      props.type,
                      isMobile
                    )
                  : renderButtonItem(
                      item,
                      index,
                      menuItems.length,
                      activeIndex,
                      itemRefs,
                      props.type,
                      closeMenu
                    )
              )}
            </div>
          )}
        </div>
      </Popover>
    </React.Fragment>
  );
}
