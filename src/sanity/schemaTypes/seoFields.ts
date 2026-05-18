import { defineField, defineType } from "sanity";

export const seoFieldsType = defineType({
  name: "seoFields",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Tytuł strony widoczny w wynikach wyszukiwania (zalecane do 60 znaków)",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      description: "Opis strony widoczny w wynikach wyszukiwania (zalecane do 160 znaków)",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "ogTitle",
      title: "Open Graph title",
      type: "string",
      description: "Opcjonalny tytuł dla udostępnień (Facebook/LinkedIn)",
      validation: (Rule) => Rule.max(95),
    }),
    defineField({
      name: "ogDescription",
      title: "Open Graph description",
      type: "text",
      rows: 3,
      description: "Opcjonalny opis dla udostępnień (Facebook/LinkedIn)",
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph image",
      type: "image",
      description: "Obraz do udostępniania, najlepiej 1200x630 px",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Tekst alternatywny obrazu OG",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value?.asset) {
            return true;
          }

          if (!value?.alt) {
            return "Uzupełnij ALT dla obrazu Open Graph";
          }

          return true;
        }),
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (override)",
      type: "url",
      description:
        "Opcjonalne nadpisanie canonical URL. Jeśli puste, canonical będzie pobierany automatycznie z aktualnego URL.",
    }),
    defineField({
      name: "robots",
      title: "Robots",
      type: "string",
      initialValue: "index,follow",
      options: {
        list: [
          { title: "Index, follow", value: "index,follow" },
          { title: "Noindex, follow", value: "noindex,follow" },
          { title: "Index, nofollow", value: "index,nofollow" },
          { title: "Noindex, nofollow", value: "noindex,nofollow" },
        ],
      },
    }),
  ],
});
