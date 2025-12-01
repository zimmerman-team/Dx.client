import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesWhyDataxplorer: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-why-dataxplorer`),
};

export default pagesWhyDataxplorer;
