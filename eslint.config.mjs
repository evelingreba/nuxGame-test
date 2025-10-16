// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
// @ts-ignore
import eslintPluginNuxt from 'eslint-plugin-nuxt';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginVue from 'eslint-plugin-vue';
import unicorn from 'eslint-plugin-unicorn';

export default withNuxt(
    {
        ignores: ['**/node_modules/**', '.nuxt', 'server/node_modules', 'server/out'],
        plugins: {
            nuxt: eslintPluginNuxt,
            import: eslintPluginImport,
            vue: eslintPluginVue,
            unicorn,
        },
        rules: {
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debug': 'off',
            'vue/no-v-html': 'off',
            'vue/multi-word-component-names': 'off',
            'vue/no-multiple-template-root': 'off',
            'vue/html-self-closing': [
                'error',
                {
                    html: {
                        void: 'always',
                        normal: 'always',
                        component: 'always',
                    },
                    svg: 'always',
                    math: 'always',
                },
            ],
            'vue/html-closing-bracket-spacing': 'off',
            'vue/no-duplicate-attributes': 'off',
            'vue/attribute-hyphenation': 'off',
            'vue/component-definition-name-casing': ['error', 'kebab-case'],
            'vue/html-quotes': ['error', 'double', { avoidEscape: true }],
            'vue/v-on-event-hyphenation': ['error', 'never'],
            'vue/first-attribute-linebreak': [
                'error',
                {
                    singleline: 'ignore',
                    multiline: 'below',
                },
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    singleline: {
                        max: 1,
                    },
                    multiline: {
                        max: 1,
                    },
                },
            ],
            'vue/block-tag-newline': [
                'error',
                {
                    blocks: {
                        template: {
                            singleline: 'always',
                            multiline: 'always',
                            maxEmptyLines: 1,
                        },
                    },
                },
            ],
            'unicorn/prefer-at': 'error',
            'unicorn/no-array-reduce': 'off',
            'selector-pseudo-element-colon-notation': 'off',
            'alpha-value-notation': 'off',
            'declaration-empty-line-before': 'off',
            'custom-property-empty-line-before': 'off',
            'color-hex-length': 'off',
            'no-duplicate-selectors': 'off',
            'no-empty-source': 'off',
            // 'scss/dollar-variable-empty-line-before': ['always', {
            //   'except': [
            //     'first-nested',
            //     'after-comment',
            //     'after-dollar-variable'
            //   ]
            // }]
            "scss/dollar-variable-empty-line-before": 'off'
        },

        // "extends": "stylelint-config-recommended-scss"
        // ignorePatterns: ['node_modules/**', '.nuxt/**', 'server/node
    },
)
