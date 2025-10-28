import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const componentsFooter: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/components-footer`),
};

export default componentsFooter;
