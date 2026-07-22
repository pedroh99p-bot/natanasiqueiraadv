import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.SITE_URL ?? 'https://natanasiqueiraadv.vercel.app';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: [sitemap()],
});
