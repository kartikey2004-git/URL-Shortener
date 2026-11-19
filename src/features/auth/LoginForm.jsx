import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail } from "lucide-react";

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
import { login } from "./api";
import { useAuth } from "./auth-context";
import { loginSchema } from "./schemas";

export function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingUrl = searchParams.get(CREATE_NEW_PARAM);

  const { refreshUser } = useAuth();
  const { loading, error, run: runLogin } = useFetch(login);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = await validateForm(loginSchema, formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const { error: loginError } = await runLogin(formData);
    if (loginError) return;

    await refreshUser();
    navigate(withPendingUrl(routes.dashboard, pendingUrl), { replace: true });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate>
        <CardHeader>
          <CardTitle className="text-xl font-black">Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && <Alert variant="destructive">{error.message}</Alert>}

          <TextField
            id="email"
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
            id="password"
            name="password"
            type="password"
            label="Password"
            icon={Lock}
            placeholder="••••••••"
            autoComplete="current-password"
            onChange={handleChange}
            error={fieldErrors.password}
          />
        </CardContent>

        <CardFooter className="pb-6">
          <Button type="submit" className="w-full font-bold" loading={loading}>
            Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
