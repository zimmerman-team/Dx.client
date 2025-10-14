import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesPartners: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/pages-partners`),
};

export default pagesPartners;
