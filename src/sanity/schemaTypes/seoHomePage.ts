import { defineField, defineType } from "sanity";

export const seoHomePageType = defineType({
  name: "seoHomePage",
  title: "SEO — Strona główna",
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
        title: "SEO — Strona główna",
      };
    },
  },
});
