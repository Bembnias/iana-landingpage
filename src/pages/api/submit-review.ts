import type { APIRoute } from "astro";
import { createClient } from "@sanity/client";
import { z } from "zod/v4";

export const prerender = false;

const reviewSchema = z.object({
  token: z.string().min(1),
  provider: z.enum(["google", "facebook"]),
  productSlug: z.string().min(1),
  rating: z.number().min(1).max(5),
  content: z.string().min(10).max(500),
});

/** Verify Google ID token and extract user info */
async function verifyGoogleToken(idToken: string) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
  );

  if (!res.ok) {
    throw new Error("Nieprawidłowy token Google");
  }

  const data = await res.json();
  const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;

  if (data.aud !== clientId) {
    throw new Error("Token Google nie pasuje do aplikacji");
  }

  return {
    id: data.sub as string,
    name: (data.name || data.given_name || "Użytkownik Google") as string,
    email: (data.email || "") as string,
    avatar: (data.picture || "") as string,
  };
}

/** Verify Facebook access token and extract user info */
async function verifyFacebookToken(accessToken: string) {
  const res = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.width(96).height(96)&access_token=${encodeURIComponent(accessToken)}`,
  );

  if (!res.ok) {
    throw new Error("Nieprawidłowy token Facebook");
  }

  const data = await res.json();

  return {
    id: data.id as string,
    name: (data.name || "Użytkownik Facebook") as string,
    email: (data.email || "") as string,
    avatar: (data.picture?.data?.url || "") as string,
  };
}

export const POST: APIRoute = async ({ request }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Nieprawidłowe dane JSON" }),
      { status: 400 },
    );
  }

  const result = reviewSchema.safeParse(body);

  if (!result.success) {
    return new Response(
      JSON.stringify({ error: "Nieprawidłowe dane formularza" }),
      { status: 400 },
    );
  }

  const { token, provider, productSlug, rating, content } = result.data;

  // Verify social token
  let userInfo: { id: string; name: string; email: string; avatar: string };

  try {
    if (provider === "google") {
      userInfo = await verifyGoogleToken(token);
    } else {
      userInfo = await verifyFacebookToken(token);
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Błąd weryfikacji tokena";
    return new Response(JSON.stringify({ error: message }), { status: 401 });
  }

  // Create Sanity write client
  const writeToken = import.meta.env.SANITY_WRITE_TOKEN;
  if (!writeToken) {
    return new Response(
      JSON.stringify({ error: "Serwer nie jest skonfigurowany (brak tokena zapisu)" }),
      { status: 500 },
    );
  }

  const writeClient = createClient({
    projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    apiVersion: "2025-03-18",
    token: writeToken,
    useCdn: false,
  });

  // Check for duplicate review (same user + same product)
  const existingReview = await writeClient.fetch(
    `count(*[_type == "review" && authProviderId == $providerId && productSlug == $productSlug])`,
    { providerId: `${provider}:${userInfo.id}`, productSlug },
  );

  if (existingReview > 0) {
    return new Response(
      JSON.stringify({ error: "Już dodałeś opinię do tego produktu" }),
      { status: 409 },
    );
  }

  // Create the review document
  try {
    await writeClient.create({
      _type: "review",
      productSlug,
      authorName: userInfo.name,
      authorEmail: userInfo.email,
      authorAvatar: userInfo.avatar,
      authProvider: provider,
      authProviderId: `${provider}:${userInfo.id}`,
      rating,
      content,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Nie udało się zapisać opinii" }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({ ok: true, message: "Opinia została dodana i oczekuje na zatwierdzenie" }),
    { status: 201 },
  );
};
