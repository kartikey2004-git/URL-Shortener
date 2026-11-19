import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

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

const NAV_LINK_CLASS =
  "group relative py-2 text-copy-14 font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground";

// eslint-disable-next-line react/prop-types
function NavLink({ to, children }) {
  return (
    <Link to={to} className={NAV_LINK_CLASS}>
      <span>{children}</span>
      <span className="pointer-events-none absolute -inset-x-1 bottom-0 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </Link>
  );
}

export function Header() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { loading: loggingOut, run: runLogout } = useFetch(logout);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await runLogout();
    await refreshUser();
    navigate(routes.auth);
  };

  const profile = user?.user_metadata;

  return (
    <>
      <header
        className={`sticky top-0 z-(--z-sticky) w-full transition-all duration-500 ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
      >
        <div
          className={`w-full backdrop-blur-xl transition-all duration-500 ease-out ${scrolled ? "bg-background/95" : "bg-background/80"}`}
        >
          <div className="section-shell flex h-14 items-center justify-between sm:h-16">
            <nav className="flex items-center gap-3 sm:gap-5 lg:gap-6">
              <NavLink to={routes.home}>{APP_NAME}</NavLink>
              {user && <NavLink to={routes.dashboard}>Dashboard</NavLink>}
            </nav>

            <div className="flex items-center gap-1.5 sm:gap-2">
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
                      <Avatar className="size-6">
                        <AvatarImage src={profile?.profile_pic} alt={profile?.name} />
                        <AvatarFallback className="text-xs">
                          {profile?.name?.charAt(0) || "U"}
                        </AvatarFallback>
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
                <Button asChild size="sm">
                  <Link to={routes.auth}>Get Started</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {loggingOut && <PageProgress />}
    </>
  );
}
