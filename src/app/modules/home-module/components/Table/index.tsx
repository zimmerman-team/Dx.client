import React from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import { useHistory, useLocation } from "react-router-dom";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { isValidDate } from "app/utils/isValidDate";
import MenuPopover from "app/modules/home-module/components/AssetCollection/All/menuPopover";
import { AssetType } from "app/modules/home-module/components/AssetCollection/All/assetsGrid";
import { ReactComponent as AddIcon } from "app/modules/home-module/assets/add-icon.svg";
import { ReactComponent as RemoveIcon } from "app/modules/home-module/assets/remove-icon.svg";
import { FOCUS_VISIBLE_STYLE_DARK, FOCUS_VISIBLE_STYLE_LIGHT } from "app/theme";

interface IData {
  id: string;
  name: string;
  description?: string;
  createdDate: Date;
  type: string;
  isMappingValid?: boolean;
}

interface RegularCellProps {
  value: any;
  isFirstColumn: boolean;
}

interface DescriptionCellProps {
  value: any;
  isExpanded: boolean;
  onToggleExpand: React.MouseEventHandler<HTMLButtonElement>;
}

interface TableComponentProps {
  inChartBuilder?: boolean;
  onItemClick?: (v: string) => void;
  all?: boolean;
  tableData: {
    columns: {
      key: string;
      label: string;
      icon?: React.ReactNode;
    }[];
    data: any[];
  };
  handleDelete?: (id: string) => void;
  handleDuplicate?: (id: string, type: AssetType) => void;
  setActiveAssetType?: React.Dispatch<React.SetStateAction<AssetType | null>>;
  cellWidths: number[];
}

interface ActionsCellProps {
  data: any;

  handleDelete: (id: string) => void;
  handleDuplicate: (id: string, type: AssetType) => void;
  getEditDetailPath: (data: any) => string;
  setActiveAssetType?: (type: AssetType | null) => void;
}

// Utility functions

const formatCellValue = (value: any): string => {
  if (isValidDate(value)) {
    return moment(value).format("MM-DD-YYYY");
  }
  return value ?? "";
};

const getCellStyles = (width: number) => ({
  maxWidth: `${width - 16}px`,
  minWidth: `${width - 16}px`,
  overflow: "hidden",
});

const getTextStyles = (
  isExpanded: boolean,
  isDescription: boolean,
  isFirstColumn: boolean
) =>
  ` margin: 0;
  overflow: ${isExpanded && isDescription ? "visible" : "hidden"};
  white-space: ${isExpanded && isDescription ? "normal" : "nowrap"};
  padding: ${isExpanded && isDescription ? "15px 0px" : "auto"};
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
  text-align: ${isFirstColumn ? "center" : "left"};
  text-decoration: ${isFirstColumn ? "underline" : "none"};
  text-underline-position: from-font;`;

// Sub-components

const DescriptionCell: React.FC<DescriptionCellProps> = ({
  value,
  isExpanded,
  onToggleExpand,
}) => (
  <div
    css={`
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      button {
        background: none;
        border: none;
        cursor: pointer;
        svg {
          flex-shrink: 0;
          path {
            stroke: #231d2c;
          }
        }
        :focus-visible {
          ${FOCUS_VISIBLE_STYLE_LIGHT}
        }
      }
    `}
  >
    <p title={value} css={getTextStyles(isExpanded, true, false)}>
      {formatCellValue(value)}
    </p>
    <button onClick={onToggleExpand}>
      {isExpanded ? <RemoveIcon /> : <AddIcon />}
    </button>
  </div>
);

const RegularCell: React.FC<RegularCellProps> = ({ value, isFirstColumn }) => (
  <p title={value} css={getTextStyles(false, false, isFirstColumn)}>
    {formatCellValue(value)}
  </p>
);

const ActionsCell: React.FC<ActionsCellProps> = ({
  data,
  handleDelete,
  handleDuplicate,
  getEditDetailPath,
  setActiveAssetType,
}) => (
  <TableCell
    style={{ minWidth: "10px", maxWidth: "10px" }}
    css={`
      position: relative;
      padding: 0 5px !important;
    `}
  >
    <MenuPopover
      type={data.type}
      handleDelete={() => {
        setActiveAssetType?.(data.type);
        handleDelete?.(data.id as string);
      }}
      handleDuplicate={() => handleDuplicate?.(data.id as string, data.type)}
      id={data.id}
      owner={data.owner}
      path={getEditDetailPath(data)}
      left="0%"
      dataCy=""
      dataTestId=""
      menuId="table-menu"
    />
  </TableCell>
);

export function HomepageTable(props: Readonly<TableComponentProps>) {
  const history = useHistory();
  const location = useLocation();
  const [expandDescription, setExpandDescription] = React.useState<
    Record<string, boolean>
  >({});

  const getDestinationPath = (data: IData) => {
    let destinationPath = `/${data.type}/${data.id}`;
    if (data.type === "dataset") {
      destinationPath = `/${data.type}/${data.id}?${
        location.pathname === "/" ? "fromHome=true" : ""
      }`;
    }
    return destinationPath;
  };

  const getEditDetailPath = (data: IData) => {
    let editDetailPath = `/${data.type}/${data.id}/edit`;
    if (data.type === "chart") {
      editDetailPath = data.isMappingValid
        ? `/${data.type}/${data.id}/customize`
        : `/${data.type}/${data.id}/mapping`;
    }
    return editDetailPath;
  };

  const handleRowClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
    data: any
  ) => {
    e.stopPropagation();
    if (!props.inChartBuilder) {
      history.push(getDestinationPath(data));
    } else if (props.inChartBuilder && props.onItemClick) {
      props.onItemClick(data.id);
    }
  };

  const handleExpandToggle = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    dataId: string,
    index: number
  ) => {
    e.stopPropagation();
    const key = dataId || index;
    setExpandDescription((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <TableContainer
      css={`
        border-radius: 8px;
        padding-bottom: 20px;
        overflow-x: auto;
        min-width: 100%;
      `}
    >
      <Table
        id="assets-table"
        css={`
          border-spacing: 0;
          border-style: hidden;
          border-collapse: collapse;
        `}
        data-cy="homepage-table"
      >
        <TableHead
          css={`
            background: #f1f3f5;

            > tr > th {
              font-size: 14px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              height: 51px;
              padding: 0 16px;
            }
          `}
        >
          <TableRow>
            <TableCell style={{ minWidth: "10px" }}></TableCell>
            {props.tableData.columns.map((val, i) => (
              <TableCell
                key={val.key}
                style={{
                  maxWidth: props.cellWidths[i + 1] - 16 + "px",
                  minWidth: props.cellWidths[i + 1] - 16 + "px",
                  overflow: "hidden",
                }}
              >
                {val.label}
              </TableCell>
            ))}
            <TableCell
              style={{ minWidth: "10px", maxWidth: "10px" }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          css={`
            background: #fff;
          `}
        >
          {props.tableData.data.map((data: any, rowIndex: any) => (
            <TableRow
              key={data.id}
              onClick={(e) => handleRowClick(e, data)}
              css={`
                &:hover {
                  cursor: pointer;
                }

                td {
                  padding: 0 16px;
                  height: 51px;
                }
              `}
              data-cy={`table-row-${data.type}`}
            >
              {/* Row number cell */}
              <TableCell style={{ minWidth: "10px", maxWidth: "10px" }}>
                {" "}
                {rowIndex + 1}
              </TableCell>

              {/* Data cells */}
              {props.tableData.columns.map((column, columnIndex) => {
                const isExpanded = expandDescription[data.id || rowIndex];
                const isDescription = column.label === "Description";

                return (
                  <TableCell
                    key={column.key}
                    style={getCellStyles(props.cellWidths[columnIndex + 1])}
                  >
                    {isDescription ? (
                      <DescriptionCell
                        value={data[column.key]}
                        isExpanded={!!isExpanded}
                        onToggleExpand={(e) => {
                          handleExpandToggle(e, data.id, rowIndex);
                        }}
                      />
                    ) : (
                      <RegularCell
                        value={data[column.key]}
                        isFirstColumn={false}
                      />
                    )}
                  </TableCell>
                );
              })}
              {/* Actions cell */}
              <ActionsCell
                data={data}
                handleDelete={props.handleDelete || (() => {})}
                handleDuplicate={props.handleDuplicate || (() => {})}
                getEditDetailPath={getEditDetailPath}
                setActiveAssetType={props.setActiveAssetType}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
