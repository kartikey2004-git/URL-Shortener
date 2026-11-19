import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Camera, Lock, Mail, User } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TextField } from "@/components/shared/TextField";
import { useFetch } from "@/hooks/use-fetch";
import { CREATE_NEW_PARAM, routes, withPendingUrl } from "@/lib/routes";
import { validateForm } from "@/lib/validation";
import { signup } from "./api";
import { useAuth } from "./auth-context";
import { signUpSchema } from "./schemas";

export function SignUpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingUrl = searchParams.get(CREATE_NEW_PARAM);

  const { refreshUser } = useAuth();
  const { loading, error, run: runSignUp } = useFetch(signup);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = await validateForm(signUpSchema, formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { error: signUpError } = await runSignUp(formData);
    if (signUpError) return;

    await refreshUser();
    navigate(withPendingUrl(routes.dashboard, pendingUrl), { replace: true });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardHeader>
          <CardTitle className="text-heading-20">Create account</CardTitle>
          <CardDescription>Start shortening your links in seconds.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <Alert variant="destructive">{error.message}</Alert>}

          <TextField
            id="signup-name"
            name="name"
            type="text"
            label="Full Name"
            icon={User}
            placeholder="John Doe"
            autoComplete="name"
            onChange={handleChange}
            error={fieldErrors.name}
          />

          <TextField
            id="signup-email"
            name="email"
            type="email"
            label="Email"
            icon={Mail}
            placeholder="name@example.com"
            autoComplete="email"
            onChange={handleChange}
            error={fieldErrors.email}
          />

          <TextField
            id="signup-password"
            name="password"
            type="password"
            label="Password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="new-password"
            onChange={handleChange}
            error={fieldErrors.password}
          />

          <TextField
            id="signup-profile-pic"
            name="profile_pic"
            type="file"
            accept="image/*"
            label="Profile Image"
            icon={Camera}
            className="cursor-pointer"
            onChange={handleChange}
            error={fieldErrors.profile_pic}
          />
        </CardContent>

        <CardFooter className="pb-6">
          <Button type="submit" className="w-full" loading={loading}>
            Sign Up
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
