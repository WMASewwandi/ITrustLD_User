"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/gif,image/webp,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.bmp";

function validateImageFile(file) {
  if (!file) return null;
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  if (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    type.includes("heic") ||
    type.includes("heif")
  ) {
    return "HEIC is not supported. Please upload JPG, PNG, GIF, BMP or WebP.";
  }

  if (name.endsWith(".pdf") || type === "application/pdf") {
    return "PDF is not supported. Please upload JPG, PNG, GIF, BMP or WebP image.";
  }

  if (!type.startsWith("image/")) {
    return "Please upload only image files (JPG, PNG, GIF, BMP, WebP).";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "File size must not exceed 5MB.";
  }

  return null;
}

export default function UploadSlot({ label, value, onChange, className = "", theme = "light", onError }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const dark = theme === "dark";

  useEffect(() => {
    return () => {
      if (value?.preview) URL.revokeObjectURL(value.preview);
    };
  }, [value]);

  function applyFile(file) {
    if (!file) return;
    const validationError = validateImageFile(file);
    if (validationError) {
      onError?.(validationError);
      return;
    }
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : "";
    onChange({ name: file.name, preview, file });
  }

  function onPick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    applyFile(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    applyFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className={className}>
      {label ? (
        <p className={`mb-2 text-sm font-medium ${dark ? "text-white" : "text-theme-black"}`}>{label}</p>
      ) : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`flex min-h-[180px] w-full flex-col items-center justify-center rounded-xl border border-dashed px-4 py-6 transition ${
          dragging
            ? "border-theme-green-action bg-theme-green-action/10"
            : dark
              ? "border-white/20 bg-white/[0.04] hover:border-white/35"
              : "border-[#D7DEE8] bg-[#F3F5F8] hover:border-theme-gray"
        }`}
      >
        {value?.preview ? (
          <img
            src={value.preview}
            alt={value.name || "Upload preview"}
            className="mb-3 max-h-28 rounded-md object-contain"
          />
        ) : (
          <span
            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-full border ${
              dark ? "border-white/25 text-white/50" : "border-[#C5CDD8] text-[#8A94A6]"
            }`}
          >
            <Plus className="h-6 w-6" strokeWidth={1.75} />
          </span>
        )}
        <span className={`text-sm ${dark ? "text-white/50" : "text-[#8A94A6]"}`}>
          Drag & Drop or Click to upload
        </span>
        {value?.name ? (
          <span className="mt-2 text-xs font-medium text-theme-green-action">{value.name}</span>
        ) : null}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={onPick}
      />
    </div>
  );
}
