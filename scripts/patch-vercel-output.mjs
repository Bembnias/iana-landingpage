import { readFile, writeFile } from "node:fs/promises";

const configUrl = new URL("../.vercel/output/config.json", import.meta.url);

const reportRoute = {
  src: "^/(?:Raport-Obserwatorium|raport-obserwatorium|raport-obserwatorium-az-tyle|raport-uzytkownikow)/?$",
  dest: "/documents/Raport_Obserwatorium.pdf",
  headers: {
    "content-disposition":
      "inline; filename=\"Raport_Obserwatorium.pdf\"; filename*=UTF-8''Raport%20Obserwatorium.pdf",
    "content-type": "application/pdf",
  },
};

const config = JSON.parse(await readFile(configUrl, "utf8"));
const routes = config.routes ?? [];
const routesWithoutReport = routes.filter((route) => route.src !== reportRoute.src);
const filesystemRouteIndex = routesWithoutReport.findIndex(
  (route) => route.handle === "filesystem",
);
const insertIndex = filesystemRouteIndex === -1 ? 0 : filesystemRouteIndex;

routesWithoutReport.splice(insertIndex, 0, reportRoute);
config.routes = routesWithoutReport;

await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`);
