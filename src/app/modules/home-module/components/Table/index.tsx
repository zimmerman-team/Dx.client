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
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import MenuItems from "app/modules/home-module/components/AssetCollection/All/menuItems";
import { IconButton } from "@material-ui/core";
import { assetType } from "app/modules/home-module/components/AssetCollection/All/assetsGrid";

interface IData {
  id: string;
  name: string;
  description?: string;
  createdDate: Date;
  type: string;
  isMappingValid?: boolean;
}
export function HomepageTable(
  props: Readonly<{
    inChartBuilder?: boolean;
    onItemClick?: (v: string) => void;
    all?: boolean;
    tableData: {
      columns: { key: string; label: string; icon?: React.ReactNode }[];
      data: any[];
    };
    handleDelete?: (id: string) => void;
    handleDuplicate?: (id: string, type: assetType) => void;
    setActiveAssetType?: React.Dispatch<React.SetStateAction<assetType | null>>;
    cellWidths: number[];
  }>
) {
  const history = useHistory();
  const location = useLocation();
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

  const [tableData, setTableData] = React.useState<any>([]);

  React.useEffect(() => {
    setTableData(
      props.tableData.data.map((data) => ({ ...data, isModalOpen: false }))
    );
  }, [props.tableData.data]);
  const handleCloseModal = (id: string) => {
    setTableData((prev: any) => {
      return prev.map((item: any) => {
        if (item.id === id) {
          return { ...item, isModalOpen: !item.isModalOpen };
        }
        return item;
      });
    });
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
          {tableData.map((data: any, index: any) => (
            <TableRow
              key={data.id}
              onClick={(e) => {
                e.stopPropagation();
                if (!props.inChartBuilder) {
                  history.push(getDestinationPath(data));
                } else if (props.inChartBuilder && props.onItemClick) {
                  props.onItemClick(data.id);
                }
              }}
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
              <TableCell style={{ minWidth: "10px", maxWidth: "10px" }}>
                {" "}
                {index + 1}
              </TableCell>
              {props.tableData.columns.map((val, index) => (
                <TableCell
                  key={val.key}
                  style={{
                    maxWidth: props.cellWidths[index + 1] - 16 + "px",
                    minWidth: props.cellWidths[index + 1] - 16 + "px",
                    overflow: "hidden",
                  }}
                >
                  <p
                    title={data[val.key] as string}
                    css={`
                      margin: 0;
                      overflow: hidden;
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      max-width: 100%;
                      display: block;
                      text-align: ${val.key === "id" ? "center" : "left"};
                      text-decoration: ${index === 0 ? "underline" : "none"};
                      text-underline-position: from-font;
                    `}
                  >
                    {isValidDate(data[val.key])
                      ? moment(data[val.key]).format("MM-DD-YYYY")
                      : data[val.key] ?? ""}
                  </p>
                </TableCell>
              ))}
              <TableCell
                style={{ minWidth: "10px", maxWidth: "10px" }}
                css={`
                  position: relative;
                  padding: 0 5px !important;
                `}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseModal(data.id);
                  }}
                  css={`
                    width: 10px;
                    height: 10px;
                    svg {
                      transform: rotate(90deg);
                    }
                  `}
                >
                  <MoreHorizIcon htmlColor="#231D2C" />
                </IconButton>
                <MenuItems
                  type={data.type}
                  handleClose={() => handleCloseModal(data.id)}
                  handleDelete={() => {
                    props.setActiveAssetType?.(data.type);
                    props.handleDelete?.(data.id as string);
                  }}
                  handleDuplicate={() =>
                    props.handleDuplicate?.(data.id as string, data.type)
                  }
                  id={data.id}
                  owner={data.owner}
                  path={getEditDetailPath(data)}
                  top="40px"
                  right="none"
                  left="0%"
                  alignLeft
                  display={tableData.find(
                    (d: any) => d.isModalOpen && d.id === data.id
                  )}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
