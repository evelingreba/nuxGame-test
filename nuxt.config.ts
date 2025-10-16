// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    srcDir: 'src/',

    dir: {
        public: '../public',
    },

    devtools: {
        enabled: true
    },

    alias: {
        '@constants': '../src/constants',
        '@types': '../src/types',
    },

    css: ['assets/styles/main.scss', 'vue-final-modal/style.css'],

    vite: {
        css: {
            preprocessorMaxWorkers: true,
            preprocessorOptions: {
                scss: {
                    additionalData: `
            @use "@/assets/styles/variables.scss" as *;
            @use "@/assets/styles/mixins.scss" as *;
          `,
                },
            },
        },

        plugins: [require('vite-svg-loader')()]
    },

    features: {
        inlineStyles: true,
    },

    modules: [
        '@pinia/nuxt',
        '@nuxt/eslint',
        '@vue-final-modal/nuxt',
        [
            '@vee-validate/nuxt',
            {
                autoImports: false,
            },
        ],
    ]
})