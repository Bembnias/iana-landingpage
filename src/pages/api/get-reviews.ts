import type { APIRoute } from "astro";
import { sanityClient } from "sanity:client";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const productSlug = url.searchParams.get("product");

  if (!productSlug) {
    return new Response(
      JSON.stringify({ error: "Brak parametru 'product'" }),
      { status: 400 },
    );
  }

  try {
    const reviews = await sanityClient.fetch(
      `*[_type == "review" && productSlug == $productSlug && status == "published"] | order(createdAt desc) {
        _id,
        authorName,
        authorAvatar,
        authProvider,
        rating,
        content,
        createdAt
      }`,
      { productSlug },
    );

    // Calculate average rating
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce(
            (sum: number, r: { rating: number }) => sum + r.rating,
            0,
          ) / totalReviews
        : 0;

    return new Response(
      JSON.stringify({
        reviews,
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "Nie udało się pobrać opinii" }),
      { status: 500 },
    );
  }
};
