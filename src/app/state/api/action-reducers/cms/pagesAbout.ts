import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesAbout: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-about`),
};

export default pagesAbout;
