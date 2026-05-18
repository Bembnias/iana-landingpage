import { defineField, defineType } from "sanity";

export const routinePageType = defineType({
  name: "routinePage",
  title: "Strona rutyny",
  type: "document",
  fields: [
    defineField({
      name: "routineSlug",
      title: "Slug rutyny",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Elastyczność i energia", value: "elastycznosc-i-energia" },
          { title: "Komfort i odpoczynek", value: "komfort-i-odpoczynek" },
          { title: "Mobilność i spokój", value: "mobilnosc-i-spokoj" },
        ],
      },
    }),
    defineField({
      name: "title",
      title: "Tytuł rutyny (H1)",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Wstęp (prawa kolumna)",
      type: "blockContent",
    }),
    defineField({
      name: "usageShort",
      title: "Krótki opis stosowania (prawa kolumna)",
      type: "blockContent",
    }),
    defineField({
      name: "description",
      title: "Opis (lewa kolumna)",
      type: "blockContent",
    }),
    defineField({
      name: "benefits",
      title: "Lista korzyści",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "usageFull",
      title: "Wskazówki dotyczące stosowania",
      type: "blockContent",
    }),
    defineField({
      name: "tips",
      title: "Nasze porady",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: {
      routineSlug: "routineSlug",
      title: "title",
    },
    prepare({ routineSlug, title }) {
      return {
        title: title || "Strona rutyny",
        subtitle: routineSlug || "(brak sluga)",
      };
    },
  },
});
