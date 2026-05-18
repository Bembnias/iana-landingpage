import { defineField, defineType } from "sanity";

export const seoBlogListingPageType = defineType({
  name: "seoBlogListingPage",
  title: "SEO — Blog (listing)",
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
        title: "SEO — Blog (listing)",
      };
    },
  },
});
