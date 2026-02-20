import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesPartners: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-partners`),
};

export default pagesPartners;
