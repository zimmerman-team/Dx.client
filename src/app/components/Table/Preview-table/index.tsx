/** third party */
import React from "react";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import IconButton from "@material-ui/core/IconButton";
import TableContainer from "@material-ui/core/TableContainer";
/** project */
import { previewTablecss } from "app/components/Table/Preview-table/style";
import StatisticDisplay from "app/components/Table/Preview-table/statisticDisplay";
import { ReactComponent as SortIcon } from "app/modules/dataset-upload-module/assets/sort.svg";
import StatisticalTableToolBox, {
  ColumnDetailsProps,
} from "app/components/Table/Preview-table/StatisticalTableToolBox";

interface PreviewTableProps {
  placeUnderSubHeader?: boolean;
  columnDetails: ColumnDetailsProps;
  columns: { [key: string]: string }[];
  tableData: { [key: string]: number | string | null | boolean }[];
  dataStats: {
    name: string;
    type: "bar" | "percentage" | "unique";
    data: { name: string; value: number }[];
  }[];
}

export default function PreviewTable(props: PreviewTableProps) {
  const [toolboxDisplay, setToolboxDisplay] = React.useState(false);

  return (
    <>
      <div
        css={`
          width: max-content;
        `}
      >
        <TableContainer
          css={`
            border-radius: 19px;
          `}
        >
          <Table css={previewTablecss}>
            <TableHead
              css={`
                top: 0;
                position: sticky;
                background: #dadaf8;
              `}
            >
              <TableRow
                css={`
                  padding: 0rem 0.4rem;
                `}
              >
                {props.columns.map((val, index) => {
                  return (
                    <TableCell
                      key={val.key}
                      css={`
                        border-left: ${index == 0 ? "none" : "auto"};
                        border-top-left-radius: ${index == 0 ? "5px" : "0"};
                      `}
                    >
                      <div
                        css={`
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                          gap: 1rem;
                        `}
                      >
                        <div
                          css={`
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                            padding: 3px;
                            justify-content: center;
                            display: flex;
                            align-items: center;
                            background: #ffffff;
                          `}
                        >
                          {val.type === "string" ? "Aa" : "#"}
                        </div>
                        <p
                          css={`
                            margin: 0;
                            overflow: clip;
                            max-width: 220px;
                            text-align: left;
                            line-height: 17px;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                          `}
                        >
                          <b>{val.key}</b>
                        </p>
                        <IconButton>
                          <SortIcon />
                        </IconButton>
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                css={`
                  top: 54px;
                  position: sticky;
                  background: #f4f4f4;
                `}
              >
                {props.dataStats?.map((val) => (
                  <TableCell
                    key={val.name}
                    css={`
                      color: #000;
                      font-size: 12px;
                      // cursor: pointer;
                      background: #f4f4f4;
                    `}
                    // onClick={handleToolBoxDisplay}
                  >
                    {val.name !== "ID" && (
                      <div
                        css={`
                          background: #f4f4f4;
                        `}
                      >
                        <StatisticDisplay type={val.type} data={val.data} />
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
              {props.tableData.map((data) => (
                <TableRow
                  key={Object.values(data).join("-")}
                  css={`
                    background: #fff;
                  `}
                >
                  {props.columns.map((val, index) => (
                    <TableCell key={val.key}>
                      <p
                        css={`
                          margin: 0;
                          overflow: clip;
                          max-width: 220px;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          min-width: ${index === 0 ? "30px" : "auto"};
                          text-align: ${index === 0 ? "center" : "left"};
                        `}
                      >
                        {data[val.key]}
                      </p>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {toolboxDisplay && (
        <StatisticalTableToolBox
          {...props.columnDetails}
          position={2}
          handleClose={() => setToolboxDisplay(false)}
          placeUnderSubHeader={props.placeUnderSubHeader as boolean}
        />
      )}
    </>
  );
}
