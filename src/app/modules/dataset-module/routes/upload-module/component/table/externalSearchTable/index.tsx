import React from "react";
import moment from "moment";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import { isValidDate } from "app/utils/isValidDate";
import { IExternalDataset } from "app/modules/dataset-module/routes/upload-module/upload-steps/externalSearch";

interface IData {
  id: string;
  name: string;
  description: string;
  createdDate: Date;
  type: string;
}
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
        data-cy="homepage-table"
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
              onClick={() => {
                props.onItemClick(data);
              }}
              css={`
                &:hover {
                  cursor: pointer;
                }
                td {
                  padding: 0 16px;
                  height: 50px;
                }
              `}
              data-cy={`table-row-${data.type}`}
            >
              {props.tableData.columns.map((val, colIndex) => (
                <TableCell
                  key={val.key}
                  style={{
                    maxWidth: cellWidths[colIndex] - 16 + "px",
                    minWidth: cellWidths[colIndex] - 16 + "px",
                    overflow: "hidden",
                  }}
                >
                  {data[val.key] ? (
                    <>
                      {colIndex === 1 ? (
                        <a
                          href={data.url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          css={`
                            margin: 0;
                            overflow: hidden;
                            max-width: 99%;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            font-size: 14px;
                            max-width: 100%;
                            text-align: left;
                            line-height: normal;
                            text-decoration: underline;
                            text-underline-position: from-font;
                            font-family: "GothamNarrow-Book", "Helvetica Neue",
                              sans-serif;
                            display: flex;
                            align-items: center;
                            gap: 8px;
                            color: #231d2c;
                          `}
                        >
                          {data[val.key]}

                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M0.833008 0.834961H9.16634M9.16634 0.834961V9.16829M9.16634 0.834961L0.833008 9.16829"
                              stroke="#231D2C"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </a>
                      ) : (
                        <p
                          title={data[val.key] as string}
                          css={`
                            margin: 0;
                            overflow: hidden;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                            display: block;
                            font-size: 14px;
                            font-family: "GothamNarrow-Book", "Helvetica Neue",
                              sans-serif;

                            text-align: ${val.key === "id" ? "center" : "left"};
                            line-height: normal;
                          `}
                        >
                          {isValidDate(data[val.key])
                            ? moment(data[val.key]).format("MM-DD-YYYY")
                            : data[val.key] ?? ""}
                        </p>
                      )}
                    </>
                  ) : (
                    ""
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
