/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* third-party */
import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import remove from "lodash/remove";
import isEqual from "lodash/isEqual";
import findIndex from "lodash/findIndex";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
/* project */
import { ResetIcon } from "app/assets/icons/Reset";
import { SearchIcon } from "app/assets/icons/Search";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import { splitStrBasedOnCapitalLetters } from "app/utils/splitStrBasedOnCapitalLetters";
import {
  FilterGroupModel,
  FilterGroupOptionModel,
  FilterGroupProps,
  FilterOptionProps,
} from "app/components/ToolBoxPanel/components/filters/data";
import {
  getAllOptionsCount,
  multiCheckFilterOptions,
  multiUnCheckFilterOptions,
} from "app/modules/chart-module/routes/filters/utils";
import { isEmpty } from "lodash";
import { PrimaryButton } from "app/components/Styled/button";

interface ExpandedFilterGroupProps extends FilterGroupModel, FilterGroupProps {
  goBack: () => void;
}

export function ExpandedFilterGroup(props: ExpandedFilterGroupProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const [allSelected, setAllSelected] = React.useState(false);
  const [optionsToShow, setOptionsToShow] = React.useState(props.options);

  const allAppliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const appliedFilters = useStoreState((state) =>
    get(state.charts.appliedFilters.value, props.name, [])
  );
  const setAllAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.setValue
  );

  const [tmpAppliedFilters, setTmpAppliedFilters] = React.useState([
    ...appliedFilters,
  ]);

  const [shiftKeyDown, setShiftKeyDown] = React.useState(false);

  const [lastClickedPosition, setLastClickedPosition] = React.useState(
    appliedFilters.length - 1
  );

  React.useEffect(() => {
    //updates the allSelected state when the applied filters change
    //gets the value of all the options in the filter group
    const allOptionsCount = getAllOptionsCount(props.options);

    //checks if the length of the applied filters is equal to the length of the options in the filter group
    //if yes, then all the options are selected
    //if no, then not all the options are selected
    setAllSelected(tmpAppliedFilters.length === allOptionsCount);
  }, [tmpAppliedFilters, props.options]);

  const handleSearch = (value: string) => {
    if (value.length === 0) {
      setOptionsToShow(props.options);
      return;
    }
    const results: FilterGroupOptionModel[] = [];
    try {
      const searchOptions = (options: FilterGroupOptionModel[]) => {
        options.forEach((option) => {
          if (
            option.label.toString().toLowerCase().indexOf(value.toLowerCase()) >
            -1
          ) {
            results.push(option);
          } else if (option?.subOptions) {
            const searchResponse = searchOptions(option.subOptions);

            if (searchResponse.length) {
              results.push({
                ...option,
                subOptions: searchResponse,
              });
            }
          }
        });
        return results;
      };
      setOptionsToShow(searchOptions(props.options));
    } catch (e) {
      return results;
    }
  };

  function handleChangeAll(event: React.ChangeEvent<HTMLInputElement>) {
    const tmp: any[] = [];
    const getAllValues = (options: FilterGroupOptionModel[]) => {
      options.forEach((option: FilterGroupOptionModel) => {
        tmp.push(option.value);
        if (option.subOptions) {
          getAllValues(option.subOptions);
        }
      });
    };

    if (event.target.checked) {
      getAllValues(props.options);
      setTmpAppliedFilters(tmp);
    } else {
      setTmpAppliedFilters([]);
    }
  }

  function handleApply() {
    if (!isEqual(appliedFilters, tmpAppliedFilters)) {
      setAllAppliedFilters({
        key: props.name,
        value: tmpAppliedFilters,
      });
    }
    props.goBack();
  }

  function onOptionChange(
    checked: boolean,
    option: FilterGroupOptionModel,
    currentPosition: number
  ) {
    let tmp = [...tmpAppliedFilters];
    const optionsValueList = optionsToShow.map((o) => o.value);

    if (shiftKeyDown && checked && tmp.length > 0) {
      multiCheckFilterOptions(
        tmp,
        optionsValueList,
        currentPosition,
        lastClickedPosition
      );
    } else if (shiftKeyDown && !checked && tmp.length > 0) {
      tmp = multiUnCheckFilterOptions(
        tmp,
        optionsValueList,
        currentPosition,
        lastClickedPosition
      );
    } else if (checked) {
      tmp.push(option.value);
    } else {
      remove(tmp, (o: string) => o === option.value);
    }
    // used new Set to remove duplicates
    setTmpAppliedFilters([...new Set(tmp)]);

    //update lastClickedPosition
    setLastClickedPosition(currentPosition);
  }

  React.useEffect(() => {
    //listen for shift keydown and keyup events
    //used for multi-check of filter options
    document.addEventListener("keydown", (event) => {
      if (event.key === "Shift") {
        setShiftKeyDown(true);
      }
    });
    document.addEventListener("keyup", (event) => {
      if (event.key === "Shift") {
        setShiftKeyDown(false);
      }
    });
  }, []);

  function resetFilters() {
    if (appliedFilters.length > 0) {
      setAllAppliedFilters({
        key: props.name,
        value: [],
      });

      setTmpAppliedFilters([]);
    }
  }
  React.useEffect(() => {
    //when all applied filters are removed, reset the tmpAppliedFilters
    if (isEmpty(allAppliedFilters)) {
      setTmpAppliedFilters([]);
    }
  }, [allAppliedFilters]);

  return (
    <React.Fragment>
      <div
        css={`
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          height: 24px;
          margin-top: 16px;
        `}
      >
        <div
          onClick={props.goBack}
          css={`
            display: flex;
            flex-direction: row;
            align-items: center;
            cursor: pointer;
            > button {
              transform: rotate(-90deg);
              &:hover {
                background: transparent;
              }
            }
          `}
        >
          <IconButton aria-label="expanded-filter-close">
            <TriangleXSIcon />
          </IconButton>
          <div
            css={`
              max-width: 170px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              font-size: 14px;
            `}
          >
            {splitStrBasedOnCapitalLetters(
              `${props.name[0].toUpperCase()}${props.name.slice(
                1
              )} (${props.options.reduce(
                (prev, curr) => prev + (curr.count ?? 0),
                0
              )})`
            ).replace(/_/g, "")}
          </div>
        </div>
        <div>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={allSelected}
                onChange={handleChangeAll}
                disabled={searchValue.length > 0}
                data-cy="select-all-filters-checkbox"
              />
            }
            label="Select all"
          />
          <IconButton onClick={resetFilters} aria-label="reset-button">
            <ResetIcon />
          </IconButton>
        </div>
      </div>
      <div
        css={`
          width: 100%;
          display: flex;
          align-items: center;
          position: relative;
          height: 35px;
          margin-top: 11.5px;
          padding: 0px 20px;
          border-radius: 24px;
          background: #dfe3e6;
          box-shadow: 0px 0px 10px rgba(152, 161, 170, 0.05);
          path {
            fill: #495057;
          }
        `}
      >
        <input
          type="text"
          name="search-input"
          css={`
            width: 100%;
            outline: none;
            color: #495057;
            font-size: 14px;
            border-style: none;
            background: #dfe3e6;
            height: 100%;
          `}
          tabIndex={0}
          value={searchValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchValue(e.target.value);
            handleSearch(e.target.value);
          }}
        />
        <SearchIcon />
      </div>

      <div
        css={`
          width: 100%;
          height: 20px;
          border-bottom: 1px solid #dfe3e6;
        `}
      />
      <div
        css={`
          overflow-y: auto;
          max-height: calc(100vh - 452px);
          height: 100%;

          @media (max-width: 767px) {
            max-height: unset;
            overflow-y: unset;
          }

          &::-webkit-scrollbar {
            width: 5px;
            border-radius: 4px;
            background: #262c34;
          }
          &::-webkit-scrollbar-track {
            border-radius: 4px;
            background: #f5f5f7;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 6px;
            background: #262c34;
          }
          &::-webkit-scrollbar:horizontal {
            visibility: hidden;
          }
          &::-webkit-scrollbar-track:horizontal {
            visibility: hidden;
          }
          &::-webkit-scrollbar-thumb:horizontal {
            visibility: hidden;
          }
        `}
      >
        {optionsToShow.map((option: FilterGroupOptionModel, index: number) => (
          <FilterOption
            {...option}
            level={1}
            position={index}
            key={option.value}
            forceExpand={searchValue.length > 0}
            onOptionChange={(e) => onOptionChange(e, option, index)}
            selectedOptions={tmpAppliedFilters}
            selected={
              find(tmpAppliedFilters, (o: string) => o === option.value) !==
              undefined
            }
          />
        ))}
      </div>
      <div
        css={`
          height: 15px;
        `}
      />
      <PrimaryButton size="big" bg="dark" type="button" onClick={handleApply}>
        Apply
      </PrimaryButton>
    </React.Fragment>
  );
}

function FilterOption(props: FilterOptionProps) {
  const [showSubOptions, setShowSubOptions] = React.useState(false);

  React.useEffect(() => {
    if (props.forceExpand && !showSubOptions) {
      setShowSubOptions(true);
    } else {
      setShowSubOptions(false);
    }
  }, [props.forceExpand]);

  return (
    <div
      css={`
        width: 100%;
        display: flex;
        flex-direction: column;
        border-bottom: 1px solid #dfe3e6;
        border-bottom-style: ${props.subOptions ? "solid" : "none"};
      `}
    >
      <div
        css={`
          width: 100%;
          padding: 5px 24px;
          display: flex;
          position: relative;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          > button {
            z-index: 3;
            margin-right: 6px;
            transform: rotate(${showSubOptions ? 0 : 180}deg);
          }
        `}
      >
        <FormControlLabel
          css={`
            && {
              z-index: 3;

              span {
                font-size: 14px;
              }
            }
          `}
          control={
            <Checkbox
              color="primary"
              checked={props.selected}
              data-testid="filter-option-checkbox"
              data-cy="filter-option-checkbox"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                props.onOptionChange(
                  e.target.checked,
                  {
                    label: props.label,
                    value: props.value,
                    subOptions: props.subOptions,
                  },
                  props.level
                )
              }
            />
          }
          label={props.label + ` (${props?.count ?? ""})`}
        />
        {props.subOptions && (
          <React.Fragment>
            <div
              data-testid="expand-filter-option-overlay"
              css={`
                top: 0;
                left: 0;
                z-index: 2;
                width: 100%;
                height: 100%;
                cursor: pointer;
                position: absolute;
              `}
              onClick={() => setShowSubOptions(!showSubOptions)}
            />
            <IconButton
              onClick={() => setShowSubOptions(!showSubOptions)}
              data-testid="expand-filter-option-button"
            >
              <TriangleXSIcon />
            </IconButton>
          </React.Fragment>
        )}
      </div>

      {props.subOptions && showSubOptions && (
        <div
          css={`
            gap: 6px;
            width: 100%;
            display: flex;
            padding-left: 25px;
            flex-direction: column;

            > * {
              @supports (-webkit-touch-callout: none) and
                (not (translate: none)) {
                &:not(:last-child) {
                  margin-right: 6px;
                }
              }
            }
          `}
          data-testid="filter-sub-options"
        >
          {props.subOptions.map(
            (option: FilterGroupOptionModel, index: number) => (
              <FilterOption
                {...option}
                key={option.value}
                position={index}
                level={props.level + 1}
                forceExpand={props.forceExpand}
                onOptionChange={props.onOptionChange}
                selectedOptions={props.selectedOptions}
                selected={
                  find(
                    props.selectedOptions,
                    (o: string) => o === option.value
                  ) !== undefined
                }
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
