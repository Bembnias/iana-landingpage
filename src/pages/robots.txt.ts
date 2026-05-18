export const GET = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const origin = url.origin;

  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /studio",
    `Sitemap: ${origin}/sitemap.xml`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
