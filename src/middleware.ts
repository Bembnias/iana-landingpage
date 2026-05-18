import { defineMiddleware } from "astro:middleware";
import { loadQuery } from "./sanity/lib/load-query";
import {
  findCriticalRedirect,
  normalizePath,
  type RedirectStatusCode,
} from "./lib/critical-redirects";

type MarketingRedirect = {
  fromPath?: string;
  toPath?: string;
  statusCode?: number;
};

const IGNORED_PREFIXES = ["/_astro", "/api", "/studio"];
const IGNORED_EXACT = ["/robots.txt", "/sitemap.xml", "/favicon.ico"];
const STATIC_FILE_REGEX = /\.[a-z0-9]+$/i;
const REDIRECT_CACHE_TTL_MS = 60_000;

let cachedRedirects: MarketingRedirect[] = [];
let cachedAt = 0;

const shouldSkip = (pathname: string) => {
  if (IGNORED_EXACT.includes(pathname)) {
    return true;
  }

  if (IGNORED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return STATIC_FILE_REGEX.test(pathname);
};

const resolveDestination = (toPath: string, requestUrl: URL) => {
  if (toPath.startsWith("http://") || toPath.startsWith("https://")) {
    return toPath;
  }

  return new URL(toPath, requestUrl.origin).toString();
};

const toStatusCode = (statusCode?: number): RedirectStatusCode => {
  return statusCode === 302 ? 302 : 301;
};

const getMarketingRedirects = async () => {
  const now = Date.now();
  if (now - cachedAt < REDIRECT_CACHE_TTL_MS) {
    return cachedRedirects;
  }

  const { data } = await loadQuery<MarketingRedirect[]>({
    query: `*[_type == "redirectRule" && isEnabled == true] {
      fromPath,
      toPath,
      statusCode
    }`,
  });

  cachedRedirects = data || [];
  cachedAt = now;

  return cachedRedirects;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const method = context.request.method.toUpperCase();
  if (method !== "GET" && method !== "HEAD") {
    return next();
  }

  const requestUrl = new URL(context.request.url);
  const normalizedPath = normalizePath(requestUrl.pathname);

  if (shouldSkip(normalizedPath)) {
    return next();
  }

  const criticalRedirect = findCriticalRedirect(normalizedPath);
  if (criticalRedirect) {
    const destination = resolveDestination(criticalRedirect.toPath, requestUrl);
    const destinationPath = normalizePath(new URL(destination).pathname);

    if (destinationPath !== normalizedPath) {
      return Response.redirect(destination, criticalRedirect.statusCode);
    }
  }

  const marketingRedirects = await getMarketingRedirects();
  const marketingRedirect = marketingRedirects.find(
    (entry) => entry.fromPath && normalizePath(entry.fromPath) === normalizedPath,
  );

  if (marketingRedirect?.toPath) {
    const destination = resolveDestination(marketingRedirect.toPath, requestUrl);
    const destinationPath = normalizePath(new URL(destination).pathname);

    if (destinationPath !== normalizedPath) {
      return Response.redirect(destination, toStatusCode(marketingRedirect.statusCode));
    }
  }

  return next();
});
