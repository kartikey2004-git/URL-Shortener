import { Suspense, lazy, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarChart3, Calendar, Copy, Download, ExternalLink, MapPin, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { FieldError } from "@/components/shared/FieldError";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageProgress } from "@/components/shared/PageProgress";
import { getClicksForUrl } from "@/features/analytics/api";
import { useAuth } from "@/features/auth/auth-context";
import { deleteUrl, getUrl } from "@/features/links/api";
import {
  copyToClipboard,
  downloadQrCode,
  formatDate,
  getShortUrl,
} from "@/features/links/utils";
import { useFetch } from "@/hooks/use-fetch";
import { routes } from "@/lib/routes";

// recharts is ~230 kB and only needed once a link actually has clicks to plot.
const LocationStats = lazy(() =>
  import("@/features/analytics/LocationStats").then((module) => ({
    default: module.LocationStats,
  }))
);

const LinkDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: link, loading: loadingLink, error, run: loadLink } = useFetch(getUrl);
  const { data: clicks, loading: loadingClicks, run: loadClicks } = useFetch(getClicksForUrl);
  const { loading: deleting, run: runDelete } = useFetch(deleteUrl);
  const { loading: downloading, error: downloadError, run: runDownload } = useFetch(downloadQrCode);

  const userId = user?.id;

  useEffect(() => {
    if (userId) loadLink({ id, userId });
  }, [id, userId, loadLink]);

  useEffect(() => {
    if (link) loadClicks(id);
  }, [link, id, loadClicks]);

  // A link that can't be loaded (missing, or owned by someone else) sends the user back.
  useEffect(() => {
    if (error) navigate(routes.dashboard, { replace: true });
  }, [error, navigate]);

  const handleDelete = async () => {
    const { error: deleteError } = await runDelete(id);
    if (!deleteError) navigate(routes.dashboard);
  };

  const shortUrl = link ? getShortUrl(link) : "";

  return (
    <div className="flex flex-col gap-10">
      {(loadingLink || loadingClicks) && <PageProgress />}

      <PageHeader
        title={link?.title || "Loading..."}
        description={
          <div className="flex items-center gap-2 body-text">
            <Calendar aria-hidden="true" className="h-4 w-4" />
            Created {link?.created_at ? formatDate(link.created_at) : "..."}
          </div>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            loading={deleting}
          >
            {!deleting && <Trash />}
            Delete Link
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="sm:col-span-2">
          <CardHeader>
            <CardTitle>Link Details</CardTitle>
            <CardDescription>Direct access and redirection information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 rounded-md border border-border/70 p-4">
              <p className="eyebrow">Short URL</p>
              <div className="flex items-center justify-between gap-4">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-copy-14-mono text-foreground transition-opacity duration-300 hover:opacity-65"
                >
                  {shortUrl}
                </a>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label="Copy short URL"
                  onClick={() => copyToClipboard(shortUrl)}
                >
                  <Copy />
                </Button>
              </div>
            </div>

            <div className="space-y-2 rounded-md border border-border/70 p-4">
              <p className="eyebrow">Destination URL</p>
              <div className="flex items-center justify-between gap-4">
                <a
                  href={link?.original_url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                >
                  {link?.original_url}
                </a>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground"
                  aria-label="Open destination URL"
                  onClick={() => window.open(link?.original_url, "_blank")}
                >
                  <ExternalLink />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="overflow-hidden rounded-md border border-border/70 bg-background p-3">
            <img src={link?.qr} alt="QR Code" className="h-32 w-32 object-contain" />
          </div>
          <Button
            variant="outline"
            className="w-full"
            disabled={!link}
            loading={downloading}
            onClick={() => runDownload(link)}
          >
            {!downloading && <Download />}
            Download QR
          </Button>
          <FieldError>{downloadError?.message}</FieldError>
        </Card>
      </div>

      <section className="space-y-6">
        <h2 className="heading-sm">Engagement Overviews</h2>

        {clicks?.length > 0 ? (
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="eyebrow flex items-center gap-2">
                <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                Locations
              </div>
              <Suspense fallback={<div className="h-[300px]" aria-hidden="true" />}>
                <LocationStats clicks={clicks} />
              </Suspense>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No analytics yet"
            description="Start sharing your link to capture audience data."
          />
        )}
      </section>
    </div>
  );
};

export default LinkDetailsPage;
