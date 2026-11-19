import { Suspense, lazy, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Edit3, Globe, Link as LinkIcon, Plus } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/FieldError";
import { TextField } from "@/components/shared/TextField";
import { useFetch } from "@/hooks/use-fetch";
import { CREATE_NEW_PARAM, routes } from "@/lib/routes";
import { validateForm } from "@/lib/validation";
import { useAuth } from "@/features/auth/auth-context";
import { createUrl } from "./api";
import { createLinkSchema } from "./schemas";

// The QR renderer (~28 kB) is only needed once the dialog is open.
const QRCode = lazy(() =>
  import("react-qrcode-logo").then((module) => ({ default: module.QRCode }))
);

const QR_PREVIEW_SIZE_PX = 100;
const QR_NOT_READY_MESSAGE = "The QR code is still loading. Please try again in a moment.";

/**
 * "Create Link" button + dialog. Opens automatically when the URL carries a
 * pending `createNew` value (set by the landing page / login redirect).
 */
export function CreateLinkDialog() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pendingUrl = searchParams.get(CREATE_NEW_PARAM);

  const { user } = useAuth();
  const { loading, error, run: runCreate } = useFetch(createUrl);

  const qrRef = useRef(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: pendingUrl ?? "",
    customUrl: "",
  });

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormValues((previous) => ({ ...previous, [id]: value }));
  };

  const handleOpenChange = (open) => {
    if (!open) setSearchParams({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = await validateForm(createLinkSchema, formValues);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const canvas = qrRef.current?.canvasRef?.current;
    if (!canvas) {
      // The lazily loaded QR renderer has not mounted yet.
      setFieldErrors({ qr: QR_NOT_READY_MESSAGE });
      return;
    }
    const qrBlob = await new Promise((resolve) => canvas.toBlob(resolve));

    const { data, error: createError } = await runCreate(
      { ...formValues, userId: user.id },
      qrBlob
    );
    if (!createError) navigate(routes.link(data[0].id));
  };

  return (
    <Dialog defaultOpen={Boolean(pendingUrl)} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-5 font-semibold">
          <Plus />
          Create Link
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>New short link</DialogTitle>
            <DialogDescription>
              Generate a tiny URL and a unique QR code.
            </DialogDescription>
          </DialogHeader>

          <DialogBody>
            {formValues.longUrl && (
              <div className="flex flex-col items-center gap-2">
                <div className="rounded-lg border bg-background p-3 shadow-sm">
                  <Suspense
                    fallback={
                      <div
                        style={{ width: QR_PREVIEW_SIZE_PX, height: QR_PREVIEW_SIZE_PX }}
                        aria-hidden="true"
                      />
                    }
                  >
                    <QRCode value={formValues.longUrl} size={QR_PREVIEW_SIZE_PX} ref={qrRef} />
                  </Suspense>
                </div>
                <p className="eyebrow">QR Preview</p>
                <FieldError>{fieldErrors.qr}</FieldError>
              </div>
            )}

            <div className="space-y-4">
              <TextField
                id="title"
                label="Link Title"
                icon={Edit3}
                value={formValues.title}
                placeholder="e.g. Summer Campaign"
                onChange={handleChange}
                error={fieldErrors.title}
              />

              <TextField
                id="longUrl"
                label="Destination"
                icon={LinkIcon}
                value={formValues.longUrl}
                placeholder="https://example.com/very-long-url"
                onChange={handleChange}
                error={fieldErrors.longUrl}
              />

              <div className="space-y-1.5">
                <Label htmlFor="customUrl">Custom Backhalf</Label>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 items-center whitespace-nowrap rounded-md border bg-muted px-3 text-xs font-bold text-muted-foreground">
                    <Globe aria-hidden="true" className="mr-2 h-3 w-3" />
                    {window.location.hostname}/
                  </div>
                  <Input
                    id="customUrl"
                    value={formValues.customUrl}
                    placeholder="custom-slug"
                    onChange={handleChange}
                    aria-invalid={Boolean(fieldErrors.customUrl)}
                  />
                </div>
                <FieldError>{fieldErrors.customUrl}</FieldError>
              </div>

              {error && <Alert variant="destructive">{error.message}</Alert>}
            </div>
          </DialogBody>

          <DialogFooter>
            <Button type="submit" className="h-11 w-full font-semibold" loading={loading}>
              Create Link
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
