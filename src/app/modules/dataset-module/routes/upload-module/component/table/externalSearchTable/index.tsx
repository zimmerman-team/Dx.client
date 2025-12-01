import React from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { isValidDate } from "@app/utils/isValidDate";
import { IExternalDataset } from "@app/modules/dataset-module/routes/upload-module/upload-steps/step1/externalSearch";
import AddIcon from "@app/modules/home-module/assets/add-icon.svg?react";
import RemoveIcon from "@app/modules/home-module/assets/remove-icon.svg?react";
import { FOCUS_VISIBLE_STYLE_LIGHT } from "@app/theme";

type Column = { key: string; label: string; icon?: React.ReactNode };
interface TableCellContentProps {
  data: any;
  column: Column;
  colIndex: number;
  cellWidth: number;
}
interface RegularCellProps {
  data: any;
  column: Column;
  cellWidth: number;
}

interface LinkCellProps {
  data: any;
  columnKey: string;
  cellWidth: number;
}
interface DescriptionCellProps {
  data: any;
  columnKey: string;
  itemId: string | number;
}
const LinkCell = ({ data, columnKey, cellWidth }: LinkCellProps) => (
  <a
    href={data.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    css={`
      margin: 0;
      overflow: hidden;
      max-width: 99%;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-size: 14px;
      text-align: left;
      line-height: normal;
      text-decoration: underline;
      text-underline-position: from-font;
      font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #231d2c;
      :focus-visible {
        ${FOCUS_VISIBLE_STYLE_LIGHT}
      }
    `}
  >
    {data[columnKey]}
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M0.833008 0.834961H9.16634M9.16634 0.834961V9.16829M9.16634 0.834961L0.833008 9.16829"
        stroke="#231D2C"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </a>
);

const DescriptionCell = ({ data, columnKey, itemId }: DescriptionCellProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const toggleExpansion = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      css={`
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: ${isExpanded ? "15px 0" : "auto"};

        button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          :focus-visible {
            ${FOCUS_VISIBLE_STYLE_LIGHT}
          }
          svg {
            flex-shrink: 0;
            width: 15px;
            height: 14px;

            path {
              stroke: #231d2c;
            }
          }
        }
      `}
    >
      <p
        title={data[columnKey]}
        css={`
          margin: 0;
          overflow: ${isExpanded ? "visible" : "hidden"};
          white-space: ${isExpanded ? "normal" : "nowrap"};
          text-overflow: ellipsis;
          display: block;
          font-size: 14px;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
          text-align: left;
          line-height: normal;
        `}
      >
        {formatCellValue(data[columnKey])}
      </p>
      <button onClick={toggleExpansion}>
        {isExpanded ? <RemoveIcon /> : <AddIcon />}
      </button>
    </div>
  );
};

const RegularCell = ({ data, column, cellWidth }: RegularCellProps) => {
  const textAlign = column.key === "id" ? "center" : "left";

  return (
    <p
      title={data[column.key]}
      css={`
        margin: 0;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: block;
        font-size: 14px;
        font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        text-align: ${textAlign};
        line-height: normal;
      `}
    >
      {formatCellValue(data[column.key])}
    </p>
  );
};

const formatCellValue = (value: string) => {
  if (!value) return "";
  return isValidDate(value) ? moment(value).format("MM-DD-YYYY") : value;
};

const getCellType = (colIndex: number, column: Column) => {
  if (colIndex === 1) return "link";
  if (column.label === "Description") return "description";
  return "regular";
};

const TableCellContent = ({
  data,
  column,
  colIndex,
  cellWidth,
}: TableCellContentProps) => {
  if (!data[column.key]) return <></>;

  const itemId = data.id || colIndex;
  const cellType = getCellType(colIndex, column);

  switch (cellType) {
    case "link":
      return (
        <LinkCell data={data} columnKey={column.key} cellWidth={cellWidth} />
      );

    case "description":
      return (
        <DescriptionCell data={data} columnKey={column.key} itemId={itemId} />
      );

    default:
      return <RegularCell data={data} column={column} cellWidth={cellWidth} />;
  }
};

export default function ExternalSearchTable(props: {
  onItemClick: (dataset: IExternalDataset) => void;
  tableData: {
    columns: { key: string; label: string; icon?: React.ReactNode }[];
    data: any[];
  };
}) {
  const cellWidths = [317, 200, 544, 181];
  return (
    <TableContainer
      css={`
        border-radius: 8px;
        overflow-x: auto;
        min-width: 100%;
      `}
    >
      <Table
        css={`
          border-spacing: 0;
          border-style: hidden;
          border-collapse: collapse;
        `}
        data-cy="external-search-table"
      >
        <TableHead
          css={`
            background: #f1f3f5;
            > tr > th {
              font-size: 14px;
              font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
              height: 50px;
              padding: 0 16px;
            }
          `}
        >
          <TableRow>
            {props.tableData.columns.map((val, i) => (
              <TableCell
                key={val.key}
                style={{
                  maxWidth: cellWidths[i] - 16 + "px",
                  minWidth: cellWidths[i] - 16 + "px",
                  overflow: "hidden",
                }}
              >
                {val.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody
          css={`
            background: #fff;
          `}
        >
          {props.tableData.data.map((data, index) => (
            <TableRow
              key={`${data.id}-${index}`}
              tabIndex={0}
              onClick={() => props.onItemClick(data)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  props.onItemClick(data);
                }
              }}
              css={`
                &:hover {
                  cursor: pointer;
                }
                &:focus-visible {
                  border: 2px solid #231d2c;
                }
                td {
                  padding: 0 16px;
                  height: 50px;
                }
              `}
              data-cy={`table-row-${data.type}`}
            >
              {props.tableData.columns.map((column, colIndex) => (
                <TableCell
                  key={column.key}
                  style={{
                    maxWidth: cellWidths[colIndex] - 16 + "px",
                    minWidth: cellWidths[colIndex] - 16 + "px",
                    overflow: "hidden",
                  }}
                >
                  <TableCellContent
                    data={data}
                    column={column}
                    colIndex={colIndex}
                    cellWidth={cellWidths[colIndex]}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
