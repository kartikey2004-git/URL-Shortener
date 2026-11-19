import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageProgress } from "@/components/shared/PageProgress";
import { recordClick } from "@/features/analytics/api";
import { getLongUrl } from "@/features/links/api";
import { useFetch } from "@/hooks/use-fetch";
import { routes } from "@/lib/routes";

/** Resolves a short code, records the click, then sends the visitor to the destination. */
const RedirectPage = () => {
  const { id: slug } = useParams();
  const { error, run: resolveLink } = useFetch(getLongUrl);

  // Guards against StrictMode's double effect so a visit is only counted once.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      const { data: link, error: resolveError } = await resolveLink(slug);
      if (resolveError) return;

      await recordClick(link.id);
      window.location.href = link.original_url;
    })();
  }, [slug, resolveLink]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 pt-16 text-center">
        <Alert variant="destructive">{error.message}</Alert>
        <Button asChild variant="outline">
          <Link to={routes.home}>Go to homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageProgress />
      <p className="pt-8 text-center text-muted-foreground">Redirecting...</p>
    </>
  );
};

export default RedirectPage;
