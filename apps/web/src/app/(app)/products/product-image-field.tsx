"use client";

import { useRef, useState } from "react";
import { Package2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;
const BUCKET = "product-images";

function extensionFor(file: File) {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "jpg";
}

// Best-effort cleanup of a previously-uploaded object — a failure here just
// leaves an orphaned file in storage, it should never block the UI.
async function removeStorageObject(
  supabase: ReturnType<typeof createClient>,
  url: string
) {
  const marker = `/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;
  const path = url.slice(index + marker.length);
  try {
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // ignore — cleanup only
  }
}

export function ProductImageField({
  businessId,
  imageUrl,
  onChange,
}: {
  businessId: string | null;
  imageUrl: string | null;
  onChange: (url: string | null) => void;
}) {
  const supabase = createClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!businessId) {
      setError("Still loading your business — try again in a moment.");
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WEBP image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError(null);
    setUploading(true);
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);

    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;
    const path = `${businessId}/${uniqueName}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setUploading(false);
      setError(uploadError.message);
      URL.revokeObjectURL(preview);
      setLocalPreview(null);
      return;
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const previousUrl = imageUrl;

    setUploading(false);
    URL.revokeObjectURL(preview);
    setLocalPreview(null);
    onChange(data.publicUrl);

    if (previousUrl) removeStorageObject(supabase, previousUrl);
  }

  function handleRemove() {
    if (imageUrl) removeStorageObject(supabase, imageUrl);
    onChange(null);
    setError(null);
  }

  const previewSrc = localPreview ?? imageUrl;

  return (
    <div>
      <div className="block text-sm font-medium text-slate-700">
        Product image <span className="font-normal text-slate-400">(optional)</span>
      </div>
      <div className="mt-1.5 flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f0eee8]">
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- external Supabase Storage URL, not a static asset
            <img src={previewSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <Package2 className="h-8 w-8 text-slate-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "Uploading..." : imageUrl ? "Replace" : "Upload image"}
            </button>
            {imageUrl && !uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">JPG, PNG, or WEBP. Up to 5MB.</p>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
