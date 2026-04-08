import http from "node:http";
import https from "node:https";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type FetchedImage = {
  statusCode: number;
  headers: Record<string, string | string[] | undefined>;
  buffer: Buffer;
};

function fetchImageBuffer(url: string, redirectsLeft = 4): Promise<FetchedImage> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const client = parsed.protocol === "https:" ? https : http;

    const req = client.get(
      url,
      {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
          accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          referer: "https://news-automation-5tjh.onrender.com/"
        }
      },
      (res) => {
        const statusCode = res.statusCode || 500;
        const location = res.headers.location;

        if (location && statusCode >= 300 && statusCode < 400 && redirectsLeft > 0) {
          const nextUrl = new URL(location, url).toString();
          res.resume();
          fetchImageBuffer(nextUrl, redirectsLeft - 1).then(resolve).catch(reject);
          return;
        }

        const chunks: Buffer[] = [];
        res.on("data", (chunk) => chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)));
        res.on("end", () => {
          resolve({
            statusCode,
            headers: res.headers,
            buffer: Buffer.concat(chunks)
          });
        });
      }
    );

    req.on("error", reject);
  });
}

export async function GET(request: NextRequest) {
  const remoteUrl = request.nextUrl.searchParams.get("url");

  if (!remoteUrl) {
    return new Response("Missing url", { status: 400 });
  }

  try {
    const response = await fetchImageBuffer(remoteUrl);
    const rawContentType = Array.isArray(response.headers["content-type"])
      ? response.headers["content-type"][0]
      : response.headers["content-type"];

    if (
      response.statusCode < 200 ||
      response.statusCode >= 300 ||
      !rawContentType ||
      !rawContentType.startsWith("image/")
    ) {
      return new Response("Image unavailable", { status: 502 });
    }

    return new Response(new Uint8Array(response.buffer), {
      status: 200,
      headers: {
        "Content-Type": rawContentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch {
    return new Response("Image unavailable", { status: 502 });
  }
}
