import { defineField, defineType } from "sanity";

export const seoRoutinePageType = defineType({
  name: "seoRoutinePage",
  title: "SEO — Rutyny",
  type: "document",
  fields: [
    defineField({
      name: "routineSlug",
      title: "Rutyna (slug)",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {
            title: "Elastyczność i energia",
            value: "elastycznosc-i-energia",
          },
          {
            title: "Komfort i odpoczynek",
            value: "komfort-i-odpoczynek",
          },
          {
            title: "Mobilność i spokój",
            value: "mobilnosc-i-spokoj",
          },
        ],
      },
    }),
    defineField({
      name: "seo",
      title: "Meta tagi",
      type: "seoFields",
    }),
  ],
  preview: {
    select: {
      routineSlug: "routineSlug",
    },
    prepare({ routineSlug }) {
      return {
        title: `SEO — Rutyna: ${routineSlug || "(brak sluga)"}`,
      };
    },
  },
});
