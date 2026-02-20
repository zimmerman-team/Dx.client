import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesWebinar: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-webinar`),
};

export default pagesWebinar;
