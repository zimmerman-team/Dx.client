import React from "react";
import { Tooltip } from "@material-ui/core";
import { ReactComponent as SearchIcon } from "app/modules/home-module/assets/search-fill.svg";
import { searchInputCss, iconButtonCss } from "app/modules/home-module/style";

export interface SearchInputProps {
  searchValue: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  hasSearchButton: boolean;
  openSearch: boolean | undefined;
  setOpenSearch?: (value: boolean) => void;
  searchIconCypressId?: string;
  inputRef?: React.RefObject<HTMLDivElement>;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchValue,
  onSearchChange,
  onFocus,
  onKeyPress,
  hasSearchButton,
  openSearch,
  setOpenSearch,
  searchIconCypressId,
  inputRef: ContainerRef,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [inputFocused, setInputFocused] = React.useState(false);
  React.useEffect(() => {
    if (openSearch) {
      inputRef?.current?.focus();
    }
  }, [openSearch]);
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "tab" && openSearch) {
      setInputFocused(true);
    }
  };

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        gap: 8px;
        width: ${openSearch ? "100%" : "auto"};
        ${!hasSearchButton &&
        `        width: 100%;
        `}
      `}
      ref={ContainerRef}
    >
      <div css={searchInputCss(!!openSearch, inputFocused)}>
        <SearchIcon role="presentation" />
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          placeholder="Search"
          onChange={onSearchChange}
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={(e) => {
            setInputFocused(true);
            onFocus?.(e);
          }}
          onKeyDown={handleInputKeyDown}
          onBlur={() => setInputFocused(false)}
          onKeyPress={onKeyPress}
          data-cy="filter-search-input"
          aria-label="search"
          name="search"
          autoComplete="search"
          aria-hidden={!openSearch}
          tabIndex={openSearch ? 0 : -1}
        />
      </div>

      {hasSearchButton && !openSearch && (
        <Tooltip title="Search" placement="bottom">
          <button
            data-cy={searchIconCypressId}
            onClick={() => {
              setOpenSearch?.(true);
              inputRef?.current?.focus();
            }}
            css={iconButtonCss(openSearch)}
            aria-label="search-button"
          >
            <SearchIcon role="presentation" />
          </button>
        </Tooltip>
      )}
    </div>
  );
};
