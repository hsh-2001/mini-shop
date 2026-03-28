import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['@/assets/css/main.css'],
  devtools: { enabled: true },

  vite: {
    plugins: [
      tailwindcss()
    ],
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
  },

  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'km', name: 'Khmer', file: 'km-KH.json' },
    ],
    defaultLocale: 'km',
    strategy: 'no_prefix',
  }
})