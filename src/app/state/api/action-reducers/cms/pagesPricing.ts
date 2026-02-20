import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesPricing: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-pricing`),
};

export default pagesPricing;
