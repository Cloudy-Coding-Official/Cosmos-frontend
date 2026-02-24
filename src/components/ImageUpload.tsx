import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadImage, validateImageFile } from "../api/upload";

type ImageUploadProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  className?: string;
};

export function ImageUpload({ value, onChange, disabled, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    setError(null);
    const err = validateImageFile(file);
    if (err) {
      setError(err);
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(true);
  };

  const handleDragLeave = () => setDrag(false);

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled || uploading}
      />

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Vista previa"
            className="w-40 h-40 rounded-lg border border-cosmos-border object-cover object-center"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
              className="text-sm text-cosmos-accent hover:underline disabled:opacity-50"
            >
              {uploading ? "Subiendo…" : "Cambiar imagen"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              disabled={disabled || uploading}
              className="text-sm text-cosmos-muted hover:text-red-500 flex items-center gap-1"
            >
              <X size={14} />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          disabled={disabled || uploading}
          className={`w-full rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            drag
              ? "border-cosmos-accent bg-cosmos-accent/10"
              : "border-cosmos-border bg-cosmos-surface/50 hover:border-cosmos-accent/50 hover:bg-cosmos-surface"
          } ${disabled || uploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {uploading ? (
            <span className="text-cosmos-muted">Subiendo imagen…</span>
          ) : (
            <>
              <Upload size={32} className="mx-auto mb-2 text-cosmos-muted" />
              <p className="text-sm font-medium text-cosmos-text m-0">
                Arrastrá una imagen o hacé clic para elegir
              </p>
              <p className="text-xs text-cosmos-muted mt-1 m-0">
                JPEG, PNG, WebP o GIF · máx. 5 MB
              </p>
              <p className="text-xs text-cosmos-accent mt-2 m-0">
                Recomendado: formato cuadrado (1:1), motivo centrado, 512×512 px
              </p>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2 m-0" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
