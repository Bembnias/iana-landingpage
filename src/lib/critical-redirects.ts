export type RedirectStatusCode = 301 | 302;

export type RedirectEntry = {
  fromPath: string;
  toPath: string;
  statusCode: RedirectStatusCode;
};

export const normalizePath = (path: string) => {
  const cleaned = path.split("?")[0].split("#")[0];
  if (!cleaned || cleaned === "/") {
    return "/";
  }

  return cleaned.endsWith("/") ? cleaned.slice(0, -1) : cleaned;
};

export const criticalRedirects: RedirectEntry[] = [];

export const findCriticalRedirect = (pathname: string) => {
  const normalizedPathname = normalizePath(pathname);
  return criticalRedirects.find(
    (entry) => normalizePath(entry.fromPath) === normalizedPathname,
  );
};
