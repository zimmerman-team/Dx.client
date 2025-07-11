/* third-party */
import React from "react";
import get from "lodash/get";
import find from "lodash/find";
import filter from "lodash/filter";
import IconButton from "@material-ui/core/IconButton";
import { useStoreState, useStoreActions } from "app/state/store/hooks";
/* project */
import { CloseIcon } from "app/assets/icons/Close";
import { TriangleXSIcon } from "app/assets/icons/TriangleXS";
import { splitStrBasedOnCapitalLetters } from "app/utils/splitStrBasedOnCapitalLetters";
import {
  FilterGroupModel,
  FilterGroupOptionModel,
} from "app/components/ToolBoxPanel/components/filters/data";

interface FilterGroupCompProps extends FilterGroupModel {
  expandGroup: () => void;
}

export function FilterGroup(props: FilterGroupCompProps) {
  const allAppliedFilters = useStoreState(
    (state) => state.charts.appliedFilters.value
  );
  const appliedFilters = useStoreState((state) =>
    get(state.charts.appliedFilters.value, props.name, [])
  );
  const setAllAppliedFilters = useStoreActions(
    (actions) => actions.charts.appliedFilters.setValue
  );

  function onFilterRemove(option: string) {
    setAllAppliedFilters({
      key: props.name,
      value: filter(appliedFilters, (af: string) => af !== option),
    });
  }

  function traverseOptions(
    options: FilterGroupOptionModel[],
    arr: FilterGroupOptionModel[]
  ) {
    options.forEach((option: FilterGroupOptionModel) => {
      arr.push({
        label: option.label,
        value: option.value,
      });
      if (option.subOptions) {
        traverseOptions(option.subOptions, arr);
      }
    });
  }

  const flattenOptions: FilterGroupOptionModel[] = React.useMemo(() => {
    const opts: FilterGroupOptionModel[] = [];
    traverseOptions(props.options, opts);
    return opts;
  }, [props.options]);

  return (
    <div
      css={`
        gap: 6px;
        width: 100%;
        display: flex;
        padding: 11px 0;
        flex-direction: column;
        border-bottom: 1px solid #dfe3e6;

        > * {
          @supports (-webkit-touch-callout: none) and (not (translate: none)) {
            &:not(:last-child) {
              margin-right: 6px;
            }
          }
        }
      `}
    >
      <div
        onClick={props.expandGroup}
        data-testid="filter-group"
        data-cy="filter-group"
        css={`
          width: 100%;
          display: flex;
          font-size: 14px;
          cursor: pointer;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;

          > button {
            margin-right: 6px;
            transform: rotate(90deg);
          }
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
        <IconButton>
          <TriangleXSIcon />
        </IconButton>
      </div>
      {appliedFilters.length > 0 && (
        <div
          data-testid="applied-filters"
          data-cy="applied-filters"
          css={`
            gap: 6px;
            width: 100%;
            display: flex;
            padding: 5px 0;
            max-width: 100%;
            overflow-x: auto;
            flex-direction: row;

            > * {
              @supports (-webkit-touch-callout: none) and
                (not (translate: none)) {
                &:not(:last-child) {
                  margin-right: 6px;
                }
              }
            }

            &::-webkit-scrollbar {
              height: 4px;
              background: #495057;
            }
            &::-webkit-scrollbar-track {
              border-radius: 4px;
              background: #f5f5f7;
            }
            &::-webkit-scrollbar-thumb {
              border-radius: 4px;
              background: #495057;
            }
          `}
        >
          {appliedFilters.map((option: string) => {
            const fOption = find(flattenOptions, { value: option });
            return (
              <div
                key={option}
                css={`
                  gap: 10px;
                  display: flex;
                  color: ${fOption ? "#495057" : "#49505766"};
                  font-size: 14px;
                  background: ${fOption ? "#fff" : "#ffffff66"};
                  padding: 6px 8px 6px 12px;
                  border-radius: 20px;
                  flex-direction: row;
                  justify-content: space-between;

                  > * {
                    @supports (-webkit-touch-callout: none) and
                      (not (translate: none)) {
                      &:not(:last-child) {
                        margin-right: 6px;
                      }
                    }
                  }

                  > div {
                    max-width: 100px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                  }
                  > svg {
                    path {
                      fill: #495057;
                    }
                  }

                  > svg:hover {
                    cursor: pointer;
                  }
                `}
              >
                <div>{fOption ? fOption.label : option}</div>
                <CloseIcon
                  data-testid={`remove-applied-filter`}
                  role="button"
                  onClick={() => onFilterRemove(option)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
