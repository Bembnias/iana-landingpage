import type { APIRoute } from "astro";
import { z } from "zod/v4";

export const prerender = false;

const schema = z.object({
    role: z.string().min(1),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.email(),
    phone: z.string().min(9),
    street: z.string().min(3),
    postalCode: z.string().regex(/^\d{2}-\d{3}$/),
    selectedRoutine: z.string().min(1),
});

export const POST: APIRoute = async ({ request }) => {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Nieprawidłowe dane JSON" }), {
            status: 400,
        });
    }

    const result = schema.safeParse(body);

    if (!result.success) {
        return new Response(JSON.stringify({ error: "Nieprawidłowe dane" }), {
            status: 400,
        });
    }

    const sheetsUrl = import.meta.env.GOOGLE_SHEETS_URL;
    if (!sheetsUrl) {
        return new Response(JSON.stringify({ error: "Serwer nie jest skonfigurowany" }), {
            status: 500,
        });
    }

    await fetch(sheetsUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
