import type { APIRoute } from "astro";
import { readFile, stat } from "node:fs/promises";

const fallbackImagePath = new URL(
  "../../public/astropaper-og.jpg",
  import.meta.url
);
const transparentPngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export const GET: APIRoute = async () => {
  try {
    await stat(fallbackImagePath);
    const buffer = await readFile(fallbackImagePath);
    return new Response(new Uint8Array(buffer), {
      headers: { "Content-Type": "image/jpeg" },
    });
  } catch {
    return new Response(
      Uint8Array.from(atob(transparentPngBase64), c => c.charCodeAt(0)),
      {
        headers: { "Content-Type": "image/png" },
      }
    );
  }
};
