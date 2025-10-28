import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesWebinar: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/pages-webinar`),
};

export default pagesWebinar;
