import { useEffect, useState } from "react";
import { Link as LinkIcon, MousePointer2, Search } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/shared/EmptyState";
import { IconInput } from "@/components/shared/IconInput";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageProgress } from "@/components/shared/PageProgress";
import { getClicksForUrls } from "@/features/analytics/api";
import { useAuth } from "@/features/auth/auth-context";
import { getUrls } from "@/features/links/api";
import { CreateLinkDialog } from "@/features/links/CreateLinkDialog";
import { LinkCard } from "@/features/links/LinkCard";
import { StatCard } from "@/features/links/StatCard";
import { useFetch } from "@/hooks/use-fetch";

const DashboardPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: links, loading: loadingLinks, error, run: loadLinks } = useFetch(getUrls);
  const { data: clicks, loading: loadingClicks, run: loadClicks } = useFetch(getClicksForUrls);

  const userId = user?.id;

  useEffect(() => {
    if (userId) loadLinks(userId);
  }, [userId, loadLinks]);

  useEffect(() => {
    if (links?.length) loadClicks(links.map((link) => link.id));
  }, [links, loadClicks]);

  const refreshLinks = () => loadLinks(userId);

  const visibleLinks = (links ?? []).filter((link) =>
    link.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const linkCount = links?.length ?? 0;
  // `clicks` is stale once every link is deleted, so only count it while links exist.
  const clickCount = linkCount > 0 ? (clicks?.length ?? 0) : 0;

  return (
    <div className="flex flex-col gap-10">
      {(loadingLinks || loadingClicks) && <PageProgress />}

      <PageHeader
        title="Dashboard"
        description={
          <p className="body-text">
            Manage and track your shortened URLs effectively.
          </p>
        }
        actions={<CreateLinkDialog />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Links Created" value={linkCount} icon={LinkIcon} />
        <StatCard label="Total Clicks" value={clickCount} icon={MousePointer2} />
      </div>

      <section className="space-y-6 border-t border-border/60 pt-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="heading-sm">Active Links</h2>

          <div className="w-full sm:w-72">
            <IconInput
              icon={Search}
              type="search"
              aria-label="Search links"
              placeholder="Search links..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
        </div>

        {error && <Alert variant="destructive">{error.message}</Alert>}

        <div className="flex flex-col">
          {links && visibleLinks.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No links found"
              description="Adjust your search or create your first short URL."
            />
          ) : (
            visibleLinks.map((link) => (
              <LinkCard key={link.id} link={link} onDeleted={refreshLinks} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
