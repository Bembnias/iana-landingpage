// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  adapter: node({ mode: "standalone" }),
  image: {
    domains: ["cdn.sanity.io"],
  },
  integrations: [
    sanity({
      projectId: 'ffg0jwpc',
      dataset: 'stage',
      useCdn: false,
      apiVersion: '2025-03-18',
      studioBasePath: '/studio',
    }),
    react(),
  ],
});