// @ts-check
import { defineConfig } from 'astro/config';

// import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare({
    sessionKVBindingName: 'SESSION_MAYERANDWATT'
  })
});