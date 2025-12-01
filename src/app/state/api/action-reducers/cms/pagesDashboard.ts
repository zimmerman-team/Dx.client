import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesDashboard: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-dashboard`),
};

export default pagesDashboard;
