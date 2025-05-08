import { Grid } from "@material-ui/core";

import { quotecss } from "app/modules/home-module/sub-modules/partners/style";
import Quote from "app/modules/home-module/assets/quote-icon.svg";

export default function QuoteBlock() {
  return (
    <Grid css={quotecss} container direction="column" alignItems="center">
      <img src={Quote} alt="quote_icon" />
      <p>
        There are multiple facets of data that we needed to be able to splice
        and dice. Dataxplorer is allowing us to do that!
      </p>
      <div>
        <p>Murad Hrji</p>
        <p>Senior Digital Architect</p>
        <p>The Global Fund to Fight AIDS, Tuberculosis and Malaria</p>
      </div>
    </Grid>
  );
}
