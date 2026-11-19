import * as yup from "yup";

import { MIN_PASSWORD_LENGTH } from "@/lib/constants";

const email = yup.string().email("Invalid Email").required("Email is required");

const password = yup
  .string()
  .min(MIN_PASSWORD_LENGTH, `Password must be at least ${MIN_PASSWORD_LENGTH} characters`)
  .required("Password is required");

export const loginSchema = yup.object({ email, password });

export const signUpSchema = yup.object({
  name: yup.string().required("Name is required"),
  email,
  password,
  profile_pic: yup.mixed().required("Profile picture is required"),
});
