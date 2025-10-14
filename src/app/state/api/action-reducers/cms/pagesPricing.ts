import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesPricing: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/pages-pricing`),
};

export default pagesPricing;
