import { defineField, defineType } from "sanity";

export const productPageType = defineType({
  name: "productPage",
  title: "Strona produktu",
  type: "document",
  fields: [
    defineField({
      name: "productSlug",
      title: "Slug produktu",
      type: "string",
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: "Elastyczność i energia", value: "elastycznosc-i-energia" },
          { title: "Intensywnie chłodzący żel", value: "intensywnie-chlodzacy-zel" },
          { title: "Kojący balsam do masażu", value: "kojacy-balsam-do-masazu" },
          { title: "Odporność chrząstki i zdrowy sen", value: "odpornosc-chrzastki-i-zdrowy-sen" },
          { title: "Relaksujący krem rozgrzewający", value: "relaksujacy-krem-rozgrzewajacy" },
          { title: "Zdrowe stawy i dobry nastrój", value: "zdrowe-stawy-dobry-nastroj" },
        ],
      },
    }),
    defineField({
      name: "productCategory",
      title: "Kategoria produktu",
      type: "string",
    }),
    defineField({
      name: "productTitle",
      title: "Tytuł produktu (linia 1)",
      type: "string",
    }),
    defineField({
      name: "productSubtitle",
      title: "Podtytuł produktu (linia 2)",
      type: "string",
    }),
    defineField({
      name: "shortDesc",
      title: "Krótki opis (sekcja prawa)",
      type: "blockContent",
    }),
    defineField({
      name: "attributes",
      title: "Lista korzyści",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "usageHeading",
      title: "Nagłówek sekcji stosowania (prawa kolumna)",
      type: "string",
      initialValue: "STOSOWANIE:",
    }),
    defineField({
      name: "usageShort",
      title: "Krótki opis stosowania (prawa kolumna)",
      type: "blockContent",
    }),
    defineField({
      name: "description",
      title: "Opis produktu (lewa kolumna)",
      type: "blockContent",
    }),
    defineField({
      name: "usageTips",
      title: "Wskazówki dotyczące stosowania",
      type: "blockContent",
    }),
    defineField({
      name: "precautions",
      title: "Środki ostrożności",
      type: "blockContent",
    }),
    defineField({
      name: "originHeading",
      title: "Nagłówek sekcji pochodzenia",
      type: "string",
    }),
    defineField({
      name: "originBody",
      title: "Treść sekcji pochodzenia",
      type: "blockContent",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoFields",
    }),
  ],
  preview: {
    select: {
      productSlug: "productSlug",
      title: "productSubtitle",
    },
    prepare({ productSlug, title }) {
      return {
        title: title || "Strona produktu",
        subtitle: productSlug || "(brak sluga)",
      };
    },
  },
});
