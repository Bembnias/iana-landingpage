import { readFile, writeFile } from "node:fs/promises";

const configUrl = new URL("../.vercel/output/config.json", import.meta.url);
const reportRouteSrc =
  "^/(?:Raport-Obserwatorium|raport-obserwatorium|raport-obserwatorium-az-tyle|raport-uzytkownikow)/?$";
const trackingQueryParamNames = [
  "_gl",
  "_ga",
  "_ga_XD1TJ9L71N",
  "_gcl_au",
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
];

const reportRedirectRoutes = trackingQueryParamNames.map((paramName) => ({
  src: reportRouteSrc,
  has: [
    {
      type: "query",
      key: paramName,
    },
  ],
  dest: "/Raport-Obserwatorium",
  status: 307,
}));

const reportRoute = {
  src: reportRouteSrc,
  dest: "/documents/Raport_Obserwatorium.pdf",
  headers: {
    "content-disposition":
      "inline; filename=\"Raport_Obserwatorium.pdf\"; filename*=UTF-8''Raport%20Obserwatorium.pdf",
    "content-type": "application/pdf",
  },
};

const config = JSON.parse(await readFile(configUrl, "utf8"));
const routes = config.routes ?? [];
const routesWithoutReport = routes.filter((route) => route.src !== reportRouteSrc);
const filesystemRouteIndex = routesWithoutReport.findIndex(
  (route) => route.handle === "filesystem",
);
const insertIndex = filesystemRouteIndex === -1 ? 0 : filesystemRouteIndex;

routesWithoutReport.splice(insertIndex, 0, ...reportRedirectRoutes, reportRoute);
config.routes = routesWithoutReport;

await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`);
