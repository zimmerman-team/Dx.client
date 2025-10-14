import { Grid } from "@material-ui/core";

import { quotecss } from "app/modules/home-module/sub-modules/partners/style";
import Quote from "app/modules/home-module/assets/quote-icon.svg";
import InlineLogo from "app/modules/home-module/assets/inline-logo";
import { useCMSData } from "app/hooks/useCMSData";
import { getCMSDataField } from "app/utils/getCMSDataField";

export default function QuoteBlock() {
  const cmsData = useCMSData({ returnData: true });
  return (
    <Grid css={quotecss} container direction="column" alignItems="center">
      <p
        css={`
          font-size: 34px;
          line-height: normal;
          text-align: center;
          font-family: "GothamNarrow-Bold", "Helvetica Neue", sans-serif;
          position: relative;
          margin: 0;
          @media (max-width: 1439px) {
            font-size: 24px;
            line-height: normal;
          }
          @media (max-width: 743px) {
            font-size: 18px;
            line-height: 24px;
          }
        `}
      >
        <img
          src={Quote}
          alt="quote_icon"
          css={`
            position: absolute;
            top: -30px;
            left: -50px;
            @media (max-width: 1439px) {
              left: -20px;
              transform: scale(0.5);
            }
          `}
        />{" "}
        {getCMSDataField(
          cmsData,
          "pagesPartners.quoteBlockText1",
          `There are multiple facets of data that we needed to be able to splice
        and dice.`
        )}
        <br />{" "}
        {getCMSDataField(
          cmsData,
          "pagesPartners.quoteBlockText2",
          `Dataxplorer is allowing us to do that!`
        )}
        <img
          src={Quote}
          alt="quote_icon"
          css={`
            transform: rotate(180deg);
            position: absolute;
            bottom: -30px;
            right: 50px;
            @media (max-width: 1439px) {
              right: -20px;
              transform: scale(0.8) rotate(180deg);
            }
            @media (max-width: 743px) {
              right: -20px;
              transform: scale(0.5) rotate(180deg);
            }
          `}
        />
      </p>
      <div>
        <p>
          {getCMSDataField(
            cmsData,
            "pagesPartners.quoteAuthor",
            `Murad Hrji | Senior Digital Architect`
          )}
        </p>

        <p>
          {getCMSDataField(
            cmsData,
            "pagesPartners.quoteAuthorRole",
            `The Global Fund to Fight AIDS, Tuberculosis and Malaria`
          )}
        </p>
      </div>
    </Grid>
  );
}
