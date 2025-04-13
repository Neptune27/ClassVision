import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.config({
        extends: ["next/core-web-vitals", "next/typescript"],
        rules: {
            'react/no-unescaped-entities': 'off',
            '@next/next/no-page-custom-font': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'react-hooks/rules-of-hooks': 'off',
            'prefer-const': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            'react/jsx-no-duplicate-props': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'react/display-name': 'off',
            'react-hooks/exhaustive-deps': 'off',


        },
    })
];

export default eslintConfig;
