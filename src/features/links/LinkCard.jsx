import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Copy, Download, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/shared/FieldError";
import { useFetch } from "@/hooks/use-fetch";
import { routes } from "@/lib/routes";
import { deleteUrl } from "./api";
import { linkShape } from "./LinkPropTypes";
import { copyToClipboard, downloadQrCode, formatDate, getShortUrl } from "./utils";

/** One row of the dashboard list: title, short URL, destination and quick actions. */
export function LinkCard({ link, onDeleted }) {
  const { loading: deleting, error: deleteError, run: runDelete } = useFetch(deleteUrl);
  const { error: downloadError, run: runDownload } = useFetch(downloadQrCode);

  const shortUrl = getShortUrl(link);
  const detailsPath = routes.link(link.id);

  const handleDelete = async () => {
    const { error } = await runDelete(link.id);
    if (!error) onDeleted();
  };

  return (
    <article className="group border-b border-border/60 py-8 first:pt-0 last:border-b-0 sm:py-10">
      <div className="flex gap-5">
        <Link
          to={detailsPath}
          aria-label={`View ${link.title || "link"} details`}
          className="hidden size-24 shrink-0 self-start overflow-hidden rounded-md border border-border/70 bg-background p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:block"
        >
          <img src={link.qr} alt="QR code" className="size-full object-contain" />
        </Link>

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="truncate font-sans text-lg font-[450] text-foreground sm:text-xl">
            <Link
              to={detailsPath}
              className="transition-opacity duration-300 hover:opacity-65 focus-visible:underline focus-visible:outline-none"
            >
              {link.title || "Untitled Link"}
            </Link>
          </h3>

          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 truncate text-copy-14-mono text-foreground transition-opacity duration-300 hover:opacity-65"
          >
            {shortUrl}
          </a>

          <p className="mt-1 truncate body-text">{link.original_url}</p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <span className="eyebrow">{formatDate(link.created_at)}</span>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                title="Copy Link"
                aria-label="Copy link"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => copyToClipboard(shortUrl)}
              >
                <Copy />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                title="Download QR"
                aria-label="Download QR code"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => runDownload(link)}
              >
                <Download />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                title="Delete Link"
                aria-label="Delete link"
                className="text-muted-foreground hover:text-destructive"
                onClick={handleDelete}
                loading={deleting}
              >
                {!deleting && <Trash />}
              </Button>
            </div>
          </div>

          <FieldError>{deleteError?.message ?? downloadError?.message}</FieldError>
        </div>
      </div>
    </article>
  );
}

LinkCard.propTypes = {
  link: linkShape.isRequired,
  /** Called after the link was deleted successfully. */
  onDeleted: PropTypes.func.isRequired,
};
