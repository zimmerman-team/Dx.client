import { APIModel } from "app/state/api";
import { CMSApiCallModel } from "app/state/api/interfaces";

const pagesContact: CMSApiCallModel = {
  ...APIModel(`${process.env.REACT_APP_CMS_API}/pages-contact`),
};

export default pagesContact;
