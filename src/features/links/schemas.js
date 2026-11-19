import * as yup from "yup";

import { validateCustomSlug } from "./slug";

export const createLinkSchema = yup.object({
  title: yup.string().required("Title is required"),
  longUrl: yup
    .string()
    .url("Must be a valid URL")
    .required("Long URL is required"),
  customUrl: yup.string().test("custom-slug", function validate(value) {
    const { error } = validateCustomSlug(value);
    return error ? this.createError({ message: error }) : true;
  }),
});
