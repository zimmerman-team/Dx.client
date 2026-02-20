import { APIModel } from "@app/state/api";
import { CMSApiCallModel } from "@app/state/api/interfaces";

const pagesContact: CMSApiCallModel = {
  ...APIModel(`${import.meta.env.VITE_CMS_API}/pages-contact`),
};

export default pagesContact;
