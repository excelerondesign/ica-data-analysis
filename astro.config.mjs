import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";

import sanity from "astro-sanity";
const id = import.meta.env.SANITY_PROJECT_ID;

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact(), sanity({
    projectId: id,
    dataset: 'production',
    useCdn: true
  })]
});