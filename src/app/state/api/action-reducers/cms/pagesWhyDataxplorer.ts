import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesWhyDataxplorer: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/pages-why-dataxplorer`),
};

export default pagesWhyDataxplorer;
