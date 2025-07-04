import * as yup from "yup";
import validator from "validator";

export const emailSchema = yup
  .object({
    email: yup
      .string()
      .matches(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
      .required(),
  })
  .required();

export function isValidUrl(url: string) {
  return (
    url.length === 0 ||
    validator.isURL(url, {
      protocols: ["https", "http"],
      require_protocol: false,
    })
  );
}
