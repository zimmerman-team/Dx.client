import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesDashboard: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/pages-dashboard`),
};

export default pagesDashboard;
