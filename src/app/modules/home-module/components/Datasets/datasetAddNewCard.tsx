import React from "react";
import Grid from "@material-ui/core/Grid";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import { ReactComponent as AddNewImage } from "app/modules/home-module/assets/add-img-white.svg";

export default function DatasetAddnewCard() {
  const history = useHistory();

  const action = () => {
    history.push("/dataset/new/upload");
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <div
        onClick={action}
        css={`
          width: 296px;
          height: 161.59px;
          background: #6061e5;
          padding: 12px 16px;
          box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.1);
          display: flex;
          border-radius: 8px;
          align-items: center;
          cursor: pointer;
        `}
      >
        <div
          css={`
            gap: 14px;
            display: flex;
            align-items: center;
            justify-content: start;
          `}
        >
          <IconButton
            css={`
              padding: 2px;
            `}
          >
            <AddNewImage />
          </IconButton>
          <hr
            css={`
              margin: 0;
              height: 49px;
              background: #ffffff;
              width: 1px;
            `}
          />
          <p>
            <p
              css={`
                fonrt-family: "GothamNarrow-Bold", sans-serif;
                margin: auto;
                color: #ffffff;
                font-size: 18px;
                font-style: normal;
                font-weight: 400;
                line-height: 20px; /* 111.111% */
                letter-spacing: 0.5px;
              `}
            >
              <b>Connect Data</b>{" "}
            </p>
          </p>
        </div>
      </div>
    </Grid>
  );
}
