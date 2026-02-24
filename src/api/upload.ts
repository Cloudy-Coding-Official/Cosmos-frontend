import { getAccessToken } from "./client";

const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export async function uploadImage(file: File): Promise<string> {
  const token = getAccessToken();
  if (!token) throw new Error("Debes iniciar sesión para subir imágenes.");

  const formData = new FormData();
  formData.append("file", file);

  const url = `${BASE_URL.replace(/\/$/, "")}/upload/image`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const message =
      typeof data.message === "string"
        ? data.message
        : Array.isArray(data.message)
          ? data.message[0]
          : "Error al subir la imagen.";
    throw new Error(message);
  }

  const data = await res.json();
  const imageUrl = data?.data?.url ?? data?.url;
  if (typeof imageUrl !== "string") throw new Error("Respuesta inválida del servidor.");
  return imageUrl;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `Formato no permitido. Usá JPEG, PNG, WebP o GIF.`;
  }
  if (file.size > MAX_SIZE) {
    return `El archivo no puede superar ${MAX_SIZE_MB} MB.`;
  }
  return null;
}
