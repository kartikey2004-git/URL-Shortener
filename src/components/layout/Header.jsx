import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LinkIcon, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageProgress } from "@/components/shared/PageProgress";
import { logout } from "@/features/auth/api";
import { useAuth } from "@/features/auth/auth-context";
import { ModeToggle } from "@/features/theme/ModeToggle";
import { useFetch } from "@/hooks/use-fetch";
import { APP_NAME } from "@/lib/constants";
import { routes } from "@/lib/routes";

export function Header() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { loading: loggingOut, run: runLogout } = useFetch(logout);

  const handleLogout = async () => {
    await runLogout();
    await refreshUser();
    navigate(routes.auth);
  };

  const profile = user?.user_metadata;

  return (
    <>
      <header className="sticky top-0 z-header border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={routes.home} className="flex items-center gap-2">
            <LinkIcon aria-hidden="true" className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">{APP_NAME}</span>
          </Link>

          <div className="flex items-center gap-4">
            <ModeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-full"
                    aria-label="Account menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.profile_pic} alt={profile?.name} />
                      <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to={routes.dashboard}>
                      <LayoutDashboard />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem disabled>
                    <User />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="px-6">
                <Link to={routes.auth}>Get Started</Link>
              </Button>
            )}
          </div>
        </nav>
      </header>

      {loggingOut && <PageProgress />}
    </>
  );
}
