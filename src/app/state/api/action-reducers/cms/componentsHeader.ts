import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const componentsHeader: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/components-header`),
};

export default componentsHeader;
