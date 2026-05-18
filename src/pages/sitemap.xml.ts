import { loadQuery } from "../sanity/lib/load-query";

type PostSitemapItem = {
  slug?: { current?: string };
  _updatedAt?: string;
  publishedAt?: string;
};

const staticPaths = [
  "/",
  "/blog",
  "/polityka-prywatnosci",
  "/produkty/elastycznosc-i-energia",
  "/produkty/intensywnie-chlodzacy-zel",
  "/produkty/kojacy-balsam-do-masazu",
  "/produkty/odpornosc-chrzastki-i-zdrowy-sen",
  "/produkty/relaksujacy-krem-rozgrzewajacy",
  "/produkty/zdrowe-stawy-dobry-nastroj",
  "/rutyna/elastycznosc-i-energia",
  "/rutyna/komfort-i-odpoczynek",
  "/rutyna/mobilnosc-i-spokoj",
];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export const GET = async ({ request }: { request: Request }) => {
  const origin = new URL(request.url).origin;
  const nowIso = new Date().toISOString();

  const { data: posts } = await loadQuery<PostSitemapItem[]>({
    query: `*[_type == "post"] | order(publishedAt desc) {
      slug,
      publishedAt,
      _updatedAt
    }`,
  });

  const staticEntries = staticPaths.map((path) => ({
    loc: `${origin}${path}`,
    lastmod: nowIso,
  }));

  const postEntries = (posts || [])
    .filter((post) => post.slug?.current)
    .map((post) => ({
      loc: `${origin}/blog/${post.slug?.current}`,
      lastmod: post._updatedAt || post.publishedAt || nowIso,
    }));

  const entries = [...staticEntries, ...postEntries]
    .map(
      (entry) =>
        `<url><loc>${escapeXml(entry.loc)}</loc><lastmod>${escapeXml(entry.lastmod)}</lastmod></url>`,
    )
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
