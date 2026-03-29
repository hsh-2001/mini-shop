import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['@/assets/css/main.css'],
  devtools: { enabled: true },
  plugins: ['~/plugins/pinia.ts'],

  vite: {
    plugins: [
      tailwindcss()
    ],
    optimizeDeps: {
      include: [
        "dayjs",
        "dayjs/plugin/*.js",
        "lodash-unified",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "axios",
      ],
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    authSecret: process.env.AUTH_SECRET,
    cfAccountId: process.env.CF_ACCOUNT_ID,
    cfAccessKey: process.env.CF_ACCESS_KEY,
    cfSecretKey: process.env.CF_SECRET_KEY,
    cfPublicUrl: process.env.CF_PUBLIC_URL,
    cfBucketName: process.env.CF_BUCKET_NAME,
  },

  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/device'
  ],
  i18n: {
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'km', name: 'Khmer', file: 'km-KH.json' },
    ],
    defaultLocale: 'km',
    strategy: 'no_prefix',
  }
})