"use client";

import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";

export default function UploadSlot({ label, value, onChange, className = "" }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    return () => {
      if (value?.preview) URL.revokeObjectURL(value.preview);
    };
  }, [value]);

  function applyFile(file) {
    if (!file) return;
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
      {label ? <p className="mb-2 text-sm font-medium text-theme-black">{label}</p> : null}
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
            ? "border-theme-green-action bg-theme-green-action/5"
            : "border-[#D7DEE8] bg-[#F3F5F8] hover:border-theme-gray"
        }`}
      >
        {value?.preview ? (
          <img src={value.preview} alt={value.name || "Upload preview"} className="mb-3 max-h-28 rounded-md object-contain" />
        ) : (
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#C5CDD8] text-[#8A94A6]">
            <Plus className="h-6 w-6" strokeWidth={1.75} />
          </span>
        )}
        <span className="text-sm text-[#8A94A6]">Drag & Drop or Click to upload</span>
        {value?.name ? <span className="mt-2 text-xs font-medium text-theme-red-action">{value.name}</span> : null}
      </button>
      <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={onPick} />
    </div>
  );
}
