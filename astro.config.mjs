// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  adapter: vercel(),
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