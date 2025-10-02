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
  inputRef,
}) => {
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
      ref={inputRef}
    >
      <div css={searchInputCss(!!openSearch)}>
        <SearchIcon role="presentation" />
        <input
          type="text"
          value={searchValue}
          placeholder="Search"
          onChange={onSearchChange}
          onMouseDown={(e) => e.stopPropagation()}
          onFocus={onFocus}
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
