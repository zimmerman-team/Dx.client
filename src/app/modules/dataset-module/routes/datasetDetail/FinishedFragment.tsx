import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  dataSetsCss,
  mobileDescriptioncss,
} from "app/modules/dataset-module/routes/upload-module/style";
import { useStoreActions } from "app/state/store/hooks";
import { useMediaQuery } from "usehooks-ts";
import { DatasetListItemAPIModel } from "app/modules/dataset-module/data";
import moment from "moment";
import { useAuth0 } from "@auth0/auth0-react";
import { PrimaryButton } from "app/components/Styled/button";
import { MOBILE_BREAKPOINT } from "app/theme";
import TablePreview from "app/modules/dataset-module/routes/upload-module/upload-steps/step2/TablePreview";

interface Props {
  data: any[];
  stats: any[];
  datasetId: string;
  dataTotalCount: number;
  dataTypes: never[];
  canDatasetEditDelete?: boolean;
  datasetDetails: DatasetListItemAPIModel;
}

export default function FinishedFragment(props: Props) {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth0();
  const isSmallScreen = useMediaQuery(`(max-width:${MOBILE_BREAKPOINT})`); //at this breakpoint, we limit user creation abilities
  const queryParams = new URLSearchParams(location.search);
  const storyPage = queryParams.get("page") as string;
  const fromHome = location.search.includes("fromHome=true");
  let redirectPath = `/dataset/${props.datasetId}${
    fromHome ? "?fromHome=true" : ""
  }`;
  if (storyPage) {
    redirectPath += `?fromstory=true&page=${storyPage}`;
  }
  const setDatasetId = useStoreActions(
    (actions) => actions.charts.dataset.setValue
  );

  function handleCreateNewChart() {
    setDatasetId(props.datasetId);
  }

  const modifiedSourceUrl = () => {
    const url = props.datasetDetails?.sourceUrl;
    if (!url) {
      return "";
    }
    if (url.startsWith("https://") || url.startsWith("http://")) {
      return url;
    } else {
      return `https://${url}`;
    }
  };

  return (
    <div css={dataSetsCss}>
      <div
        css={`
          width: 100%;
          color: #231d2c;
          font-size: 14px;
          font-weight: 400;
          font-style: normal;
          font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
        `}
      >
        <div
          css={`
            color: #231d2c;
            font-size: 16px;
            font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
            line-height: 24px;
            margin-top: 32px;
            @media (max-width: 450px) {
              display: none;
            }
          `}
        >
          {props.datasetDetails.description}
        </div>
        <div
          css={`
            width: 100%;
            display: flex;
            margin-bottom: 12px;
            justify-content: flex-end;
            margin-top: 10px;
          `}
        >
          {isSmallScreen ? (
            <></>
          ) : (
            <>
              {!isAuthenticated ? (
                <Link
                  to="/onboarding/signin"
                  css={`
                    color: #fff;
                    width: 100%;
                    width: max-content;
                    height: 48px;
                    padding: 0 24px;
                    font-size: 14px;
                    background: #6061e5;
                    border-radius: 12px;
                    font-family: "GothamNarrow-Bold", sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    :hover {
                      opacity: 0.8;
                      cursor: pointer;
                    }
                  `}
                >
                  Sign in to Create Chart
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: `/chart/new/chart-type`,
                    search: `?loadataset=true${
                      storyPage ? `&fromstory=true&page=${storyPage}` : ""
                    }`,
                  }}
                >
                  <PrimaryButton
                    size="big"
                    bg="dark"
                    type="button"
                    onClick={handleCreateNewChart}
                  >
                    create chart
                  </PrimaryButton>
                </Link>
              )}
            </>
          )}
        </div>
        <TablePreview
          data={props.data}
          stats={props.stats}
          dataTypes={props.dataTypes}
          datasetId={props.datasetId}
          dataTotalCount={props.dataTotalCount}
          canDatasetEditDelete={props.canDatasetEditDelete}
          datasetDetails={props.datasetDetails}
        />
      </div>
      <div
        css={`
          height: 32px;
        `}
      />
      <div
        css={`
          color: #70777e;
          p {
            margin-bottom: 8px;
            margin-top: 0;
            font-size: 14px;
            font-family: "GothamNarrow-Book", "Helvetica Neue", sans-serif;
            > a {
              text-decoration: none;
              color: inherit;
              border-bottom: 1px solid #70777e;
            }
          }
          @media (max-width: 500px) {
            display: none;
          }
        `}
      >
        <p>Data Title : {props.datasetDetails.name}</p>
        <p>Data Description : {props.datasetDetails.description}</p>
        <p>Data Category : {props.datasetDetails.category}</p>
        <p>Data Source : {props.datasetDetails.source}</p>
        <p>
          Link to data source:{" "}
          {props.datasetDetails.sourceUrl ? (
            <a
              href={modifiedSourceUrl()}
              rel="noreferrer noopener"
              target="_blank"
            >
              {props.datasetDetails.sourceUrl}
            </a>
          ) : (
            "NIL"
          )}
        </p>
      </div>
      <div css={mobileDescriptioncss}>
        <div>
          <p>Data Title</p>
          <p>{props.datasetDetails.name}</p>
        </div>
        <div>
          <p>Data Description</p>
          <p>{props.datasetDetails.description}</p>
        </div>
        <div>
          <p>Category</p>
          <p>{props.datasetDetails.category}</p>
        </div>
        <div>
          <p>Data Source</p>
          <p> {props.datasetDetails.source}</p>
        </div>
        <div>
          <p>Link to Data Source</p>
          <p>
            {props.datasetDetails.sourceUrl ? (
              <a
                href={modifiedSourceUrl()}
                rel="noreferrer noopener"
                target="_blank"
              >
                {props.datasetDetails.sourceUrl}
              </a>
            ) : (
              "NIL"
            )}
          </p>
        </div>
      </div>
      <div
        css={`
          display: none;
          @media (max-width: 500px) {
            display: block;
            height: 24px;
          }
        `}
      />
      <div css={mobileDescriptioncss}>
        <div>
          <p>Published date</p>
          <p>{moment(props.datasetDetails.createdDate).format("MMMM YYYY")}</p>
        </div>
        <div>
          <p>Last edit time</p>
          <p>{moment(props.datasetDetails.createdDate).format("MMMM YYYY")}</p>
        </div>
      </div>
    </div>
  );
}
