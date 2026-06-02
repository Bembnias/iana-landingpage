export const GET = async ({ request }: { request: Request }) => {
  const requestUrl = new URL(request.url);
  const trackingParamPatterns = [
    /^_gl$/,
    /^_ga(?:_.+)?$/,
    /^_gcl(?:_.+)?$/,
    /^gclid$/,
    /^gbraid$/,
    /^wbraid$/,
    /^fbclid$/,
    /^msclkid$/,
  ];
  let hasTrackingParams = false;

  for (const paramName of Array.from(requestUrl.searchParams.keys())) {
    if (trackingParamPatterns.some((pattern) => pattern.test(paramName))) {
      requestUrl.searchParams.delete(paramName);
      hasTrackingParams = true;
    }
  }

  if (hasTrackingParams) {
    return Response.redirect(requestUrl, 307);
  }

  const pdfResponse = await fetch(
    new URL("/documents/Raport_Obserwatorium.pdf", request.url),
  );
  const headers = new Headers(pdfResponse.headers);

  headers.set("content-type", "application/pdf");
  headers.set(
    "content-disposition",
    "inline; filename=\"Raport_Obserwatorium.pdf\"; filename*=UTF-8''Raport%20Obserwatorium.pdf",
  );

  return new Response(pdfResponse.body, {
    status: pdfResponse.status,
    statusText: pdfResponse.statusText,
    headers,
  });
};
