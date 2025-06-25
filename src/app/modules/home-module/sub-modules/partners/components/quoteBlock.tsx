import { Grid } from "@material-ui/core";

import { quotecss } from "app/modules/home-module/sub-modules/partners/style";
import Quote from "app/modules/home-module/assets/quote-icon.svg";
import InlineLogo from "app/modules/home-module/assets/inline-logo";

export default function QuoteBlock() {
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
        There are multiple facets of data that we needed to be able to splice
        and dice. <br />{" "}
        <InlineLogo
          css={`
            width: 226.447px;
            height: 24.223px;
            margin-top: 2px;
            @media (max-width: 1439px) {
              width: 171.224px;
              height: 18.316px;
              margin-top: 6px;
            }
            @media (max-width: 743px) {
              width: 107.306px;
              height: 11.478px;
            }
          `}
        />{" "}
        is allowing us to do that!
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
        <p>Murad Hrji | Senior Digital Architect</p>

        <p>The Global Fund to Fight AIDS, Tuberculosis and Malaria</p>
      </div>
    </Grid>
  );
}
