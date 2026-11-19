import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="flex flex-col items-center gap-8"
    >
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">{pendingUrl ? "Hold up! Let's login first" : "Welcome back"}</h1>
        <p className="body-text">Join thousands of users shortening links with {APP_NAME}.</p>
      </div>

      <Tabs defaultValue="login" className="w-full max-w-md">
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
    </motion.div>
  );
};

export default AuthPage;
