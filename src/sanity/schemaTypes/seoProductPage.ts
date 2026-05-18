import { defineField, defineType } from "sanity";

export const seoProductPageType = defineType({
  name: "seoProductPage",
  title: "SEO — Produkty",
  type: "document",
  fields: [
    defineField({
      name: "productSlug",
      title: "Produkt (slug)",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          {
            title: "Elastyczność i energia",
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
            title: "Zdrowe stawy i dobry nastrój",
            value: "zdrowe-stawy-dobry-nastroj",
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
      productSlug: "productSlug",
    },
    prepare({ productSlug }) {
      return {
        title: `SEO — Produkt: ${productSlug || "(brak sluga)"}`,
      };
    },
  },
});
