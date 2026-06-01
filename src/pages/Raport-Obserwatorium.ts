export const GET = async ({ request }: { request: Request }) => {
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
