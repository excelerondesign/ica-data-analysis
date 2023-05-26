import { defineConfig } from 'astro/config';
import preact from "@astrojs/preact";
import sanity from "astro-sanity";
import netlify from "@astrojs/netlify/functions";
const id = 'ul053n8h';


// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [preact(), sanity({
    projectId: id,
    dataset: 'production',
    apiVersion: '2023-05-26',
    useCdn: true
  })],
  adapter: netlify()
});