import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: [
      ".nuxt/**",
      ".output/**",
      "node_modules/**",
      "prisma/generated/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
        extraFileExtensions: [".vue"],
      }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
        defineEventHandler: "readonly",
        getQuery: "readonly",
        isMethod: "readonly",
        readBody: "readonly",
        computed: "readonly",
        defineEmits: "readonly",
        definePageMeta: "readonly",
        defineProps: "readonly",
        navigateTo: "readonly",
        onMounted: "readonly",
        ref: "readonly",
        useAppStore: "readonly",
        useAuth: "readonly",
        useCashierPage: "readonly",
        useCategoriesPage: "readonly",
        useCurrentLocale: "readonly",
        useGuestOrderPage: "readonly",
        useInitClientSide: "readonly",
        useNavbar: "readonly",
        useOrdersPage: "readonly",
        useProductsPage: "readonly",
        useRoute: "readonly",
        watch: "readonly",
      },
    },
    rules: {
      "no-shadow-restricted-names": "off",
      "preserve-caught-error": "off",
      "vue/attributes-order": "off",
      "vue/first-attribute-linebreak": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/html-indent": "off",
      "vue/max-attributes-per-line": "off",
      "vue/multi-word-component-names": "off",
      "vue/singleline-html-element-content-newline": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
