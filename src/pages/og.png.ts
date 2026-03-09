import type { APIRoute } from "astro";
import { readFile } from "node:fs/promises";

const fallbackImagePath = new URL("../../public/astropaper-og.jpg", import.meta.url);

export const GET: APIRoute = async () => {
  const buffer = await readFile(fallbackImagePath);
  return new Response(new Uint8Array(buffer), {
    headers: { "Content-Type": "image/jpeg" },
  });
};
