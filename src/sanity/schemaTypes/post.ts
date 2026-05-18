import { defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog - Artykuły",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tytuł",
      description: "Tytuł artykułu",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "Unikalny identyfikator artykułu używany w URL - naciśnij 'Generate' aby automatycznie wygenerować slug na podstawie tytułu",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "publishedAt",
      title: "Data publikacji",
      description: "Data publikacji artykułu",
      type: "datetime",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      description: "Obrazek wyświetlany na listingu artykułów",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Tekst alternatywny dla obrazka",
          validation: (rule) => rule.required(),
        },
      ],
      validation: (rule) =>
        rule.custom((value) => {
          if (!value?.asset) {
            return true;
          }

          if (!value?.alt) {
            return "Uzupełnij ALT dla miniatury artykułu";
          }

          return true;
        }),
    }),
    defineField({
      name: "teaser",
      title: "Teaser",
      description: "Krótki tekst wyświetlany na listingu artykułów (max 200 znaków)",
      type: "text",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "body",
      title: "Treść artykułu",
      description: "Główna treść artykułu",
      type: "blockContent",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
      description: "Opcjonalne ustawienia meta tagów dla strony artykułu",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
