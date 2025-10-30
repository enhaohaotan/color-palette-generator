"use server";

import { hex2Rgb, rgb2Hex } from "@/lib/colors";

const URL = "http://colormind.io/api/";

async function timeoutFetch(
  url: string,
  options: RequestInit,
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

export async function fetchColors(): Promise<string[]> {
  try {
    const res = await timeoutFetch(URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "default" }),
    });
    const { result } = await res.json();

    return result.map(rgb2Hex);
  } catch {
    throw new Error("Failed to fetch colors. Please try again.");
  }
}

export async function fetchColorsWithLocks({
  hexes,
  locked,
}: {
  hexes: string[];
  locked: boolean[];
}): Promise<string[]> {
  try {
    const rbgs = hexes
      .map((hex) => hex2Rgb(hex))
      .map((rgb, idx) => (locked[idx] ? rgb : "N"));
    const res = await timeoutFetch(URL, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: rbgs,
        model: "default",
      }),
    });

    const { result } = await res.json();

    const newHexColors = result.map(rgb2Hex);

    return newHexColors.map((hex: string, idx: number) =>
      locked[idx] ? hexes[idx] : hex
    );
  } catch {
    throw new Error("Failed to fetch colors. Please try again.");
  }
}
