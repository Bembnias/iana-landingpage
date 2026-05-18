import { defineField, defineType } from "sanity";

export const redirectRuleType = defineType({
  name: "redirectRule",
  title: "SEO — Przekierowania",
  type: "document",
  fields: [
    defineField({
      name: "fromPath",
      title: "Źródłowy URL",
      type: "string",
      description: "Ścieżka źródłowa, np. /stary-url",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return "To pole jest wymagane";
          }

          if (!value.startsWith("/")) {
            return "Ścieżka musi zaczynać się od /";
          }

          return true;
        }),
    }),
    defineField({
      name: "toPath",
      title: "Docelowy URL",
      type: "string",
      description: "Docelowa ścieżka lub pełny URL, np. /nowy-url albo https://example.com/nowy-url",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) {
            return "To pole jest wymagane";
          }

          if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
            return true;
          }

          return "Podaj ścieżkę zaczynającą się od / albo pełny URL";
        }),
    }),
    defineField({
      name: "statusCode",
      title: "Kod przekierowania",
      type: "number",
      initialValue: 301,
      options: {
        list: [
          { title: "301 (stałe)", value: 301 },
          { title: "302 (tymczasowe)", value: 302 },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required().min(301).max(302),
    }),
    defineField({
      name: "isEnabled",
      title: "Aktywne",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "note",
      title: "Notatka",
      type: "string",
      description: "Opcjonalny opis celu przekierowania",
    }),
  ],
  preview: {
    select: {
      fromPath: "fromPath",
      toPath: "toPath",
      statusCode: "statusCode",
      isEnabled: "isEnabled",
    },
    prepare({ fromPath, toPath, statusCode, isEnabled }) {
      const state = isEnabled ? "✅" : "⏸️";
      return {
        title: `${state} ${fromPath || "(brak źródła)"} → ${toPath || "(brak celu)"}`,
        subtitle: `HTTP ${statusCode || 301}`,
      };
    },
  },
});
