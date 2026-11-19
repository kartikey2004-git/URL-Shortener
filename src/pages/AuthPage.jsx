import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/features/auth/auth-context";
import { LoginForm } from "@/features/auth/LoginForm";
import { SignUpForm } from "@/features/auth/SignUpForm";
import { APP_NAME } from "@/lib/constants";
import { CREATE_NEW_PARAM, routes, withPendingUrl } from "@/lib/routes";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pendingUrl = searchParams.get(CREATE_NEW_PARAM);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate(withPendingUrl(routes.dashboard, pendingUrl), { replace: true });
    }
  }, [isAuthenticated, loading, navigate, pendingUrl]);

  return (
    <div className="flex flex-col items-center justify-center gap-12 pt-16">
      <div className="space-y-3 text-center">
        <h1 className="heading-page sm:text-4xl">
          {pendingUrl ? "Hold up! Let's login first" : "Welcome back"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Join thousands of users shortening links with {APP_NAME}.
        </p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">SignUp</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="signup">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
