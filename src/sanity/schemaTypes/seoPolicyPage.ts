import { defineField, defineType } from "sanity";

export const seoPolicyPageType = defineType({
  name: "seoPolicyPage",
  title: "SEO — Polityka prywatności",
  type: "document",
  fields: [
    defineField({
      name: "seo",
      title: "Meta tagi",
      type: "seoFields",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "SEO — Polityka prywatności",
      };
    },
  },
});
