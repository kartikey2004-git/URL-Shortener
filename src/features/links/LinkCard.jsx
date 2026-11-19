import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Calendar, Copy, Download, ExternalLink, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError } from "@/components/shared/FieldError";
import { useFetch } from "@/hooks/use-fetch";
import { routes } from "@/lib/routes";
import { deleteUrl } from "./api";
import { linkShape } from "./LinkPropTypes";
import { copyToClipboard, downloadQrCode, formatDate, getShortUrl } from "./utils";

/** One row of the dashboard list: QR preview, link details and quick actions. */
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
    <Card className="bg-card/50 transition-colors duration-base hover:bg-muted/10">
      <div className="flex flex-col gap-6 p-5 sm:flex-row">
        <Link
          to={detailsPath}
          aria-label={`View ${link.title || "link"} details`}
          className="block shrink-0 self-start rounded-lg border bg-background p-2"
        >
          <img src={link.qr} alt="QR code" className="h-24 w-24 object-contain" />
        </Link>

        <div className="min-w-0 flex-grow space-y-2.5">
          <div className="space-y-1">
            <Link to={detailsPath} className="inline-block max-w-full">
              <h3 className="truncate text-lg font-bold tracking-tight transition-colors duration-base hover:text-primary/80">
                {link.title || "Untitled Link"}
              </h3>
            </Link>
            <a
              href={shortUrl}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-sm font-bold text-primary hover:underline"
            >
              {shortUrl}
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink aria-hidden="true" className="h-3 w-3 shrink-0" />
            <span className="truncate">{link.original_url}</span>
          </div>

          <div className="eyebrow flex items-center gap-2">
            <Calendar aria-hidden="true" className="h-3 w-3" />
            {formatDate(link.created_at)}
          </div>

          <FieldError>{deleteError?.message ?? downloadError?.message}</FieldError>
        </div>

        <div className="flex items-center justify-end gap-2 sm:flex-col sm:border-l sm:pl-6">
          <Button
            variant="outline"
            size="icon-sm"
            title="Copy Link"
            aria-label="Copy link"
            onClick={() => copyToClipboard(shortUrl)}
          >
            <Copy />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            title="Download QR"
            aria-label="Download QR code"
            onClick={() => runDownload(link)}
          >
            <Download />
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            title="Delete Link"
            aria-label="Delete link"
            className="hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDelete}
            loading={deleting}
          >
            {!deleting && <Trash />}
          </Button>
        </div>
      </div>
    </Card>
  );
}

LinkCard.propTypes = {
  link: linkShape.isRequired,
  /** Called after the link was deleted successfully. */
  onDeleted: PropTypes.func.isRequired,
};
