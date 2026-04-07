import { defineType, defineField } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Opinie produktowe",
  type: "document",
  fields: [
    defineField({
      name: "productSlug",
      title: "Produkt (slug)",
      type: "string",
      description:
        "Identyfikator produktu, np. elastycznosc-i-energia, kojacy-balsam-do-masazu",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {
            title: "Elastyczność i Energia",
            value: "elastycznosc-i-energia",
          },
          {
            title: "Intensywnie chłodzący żel",
            value: "intensywnie-chlodzacy-zel",
          },
          {
            title: "Kojący balsam do masażu",
            value: "kojacy-balsam-do-masazu",
          },
          {
            title: "Odporność chrząstki i zdrowy sen",
            value: "odpornosc-chrzastki-i-zdrowy-sen",
          },
          {
            title: "Relaksujący krem rozgrzewający",
            value: "relaksujacy-krem-rozgrzewajacy",
          },
          {
            title: "Zdrowe stawy + Dobry nastrój",
            value: "zdrowe-stawy-dobry-nastroj",
          },
        ],
      },
    }),
    defineField({
      name: "authorName",
      title: "Imię autora",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "authorEmail",
      title: "Email autora",
      type: "string",
      description: "Nie wyświetlany publicznie",
      readOnly: true,
    }),
    defineField({
      name: "authorAvatar",
      title: "Zdjęcie profilowe (URL)",
      type: "url",
      readOnly: true,
    }),
    defineField({
      name: "authProvider",
      title: "Dostawca logowania",
      type: "string",
      options: {
        list: [
          { title: "Google", value: "google" },
          { title: "Facebook", value: "facebook" },
          { title: "Anonimowy", value: "anonymous" },
        ],
      },
      readOnly: true,
    }),
    defineField({
      name: "authProviderId",
      title: "ID dostawcy (unikalny)",
      type: "string",
      description: "Unikalny identyfikator użytkownika (social provider ID lub email)",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "rating",
      title: "Ocena (1–5)",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "content",
      title: "Treść opinii",
      type: "text",
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: "status",
      title: "Status moderacji",
      type: "string",
      options: {
        list: [
          { title: "⏳ Oczekuje na zatwierdzenie", value: "pending" },
          { title: "✅ Opublikowana", value: "published" },
          { title: "❌ Odrzucona", value: "rejected" },
        ],
        layout: "radio",
      },
      initialValue: "pending",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "createdAt",
      title: "Data dodania",
      type: "datetime",
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Data (najnowsze)",
      name: "createdAtDesc",
      by: [{ field: "createdAt", direction: "desc" }],
    },
    {
      title: "Status",
      name: "statusAsc",
      by: [{ field: "status", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      authorName: "authorName",
      rating: "rating",
      productSlug: "productSlug",
      status: "status",
      content: "content",
    },
    prepare({ authorName, rating, productSlug, status, content }) {
      const stars = "★".repeat(rating || 0) + "☆".repeat(5 - (rating || 0));
      const statusEmoji =
        status === "published" ? "✅" : status === "rejected" ? "❌" : "⏳";
      return {
        title: `${statusEmoji} ${authorName || "Anonim"} — ${stars}`,
        subtitle: `${productSlug} | ${(content || "").substring(0, 60)}...`,
      };
    },
  },
});
