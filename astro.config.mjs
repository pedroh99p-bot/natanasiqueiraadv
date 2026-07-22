import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const siteUrl = process.env.SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: siteUrl ? [sitemap()] : [],
});
