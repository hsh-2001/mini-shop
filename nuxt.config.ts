import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  css: ['@/assets/css/main.css'],
  devtools: { enabled: process.env.NODE_ENV === 'development' },
  app: {
    head: {
      title: 'Mini Shop',
      titleTemplate: '%s | Mini Shop',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        },
        {
          name: 'description',
          content: 'Browse products, place guest orders, and manage your mini shop online.'
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/icon.png' },
      ],
    }
  },
  plugins: ['~/plugins/pinia.ts', '~/plugins/element-plus.ts'],

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
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  nitro: {
    preset: 'vercel'
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
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: false
    }
  }
})
