import js from "@eslint/js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import sonarjs from "eslint-plugin-sonarjs";

export default [
  {
    ignores: ["node_modules/**", "docs/**", "coverage/**", "js/vendor/**"],
  },

  js.configs.recommended,

  {
    files: ["js/**/*.js", "service-worker.js"],
    ...sonarjs.configs.recommended,
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/cognitive-complexity": ["error", 15],
    },
  },

  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        ...globals.browser,
        emailjs: "readonly",
      },
    },
    plugins: { jsdoc },
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": "error",
      "no-undef": "error",
      "prefer-const": "error",
      "no-var": "error",
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "prefer-template": "error",

      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/check-alignment": "error",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/no-undefined-types": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-param-type": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-returns": ["error", { forceRequireReturn: true }],
      "jsdoc/require-returns-type": "error",
      "jsdoc/require-param-name": "error",
      "jsdoc/valid-types": "error",
    },
  },

  {
    files: ["service-worker.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: { ...globals.serviceworker },
    },
    plugins: { jsdoc },
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": "error",
      "prefer-const": "error",
      "no-var": "error",
      curly: ["error", "all"],
      eqeqeq: ["error", "always"],
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
          },
        },
      ],
      "jsdoc/check-tag-names": "error",
      "jsdoc/valid-types": "error",
      "jsdoc/require-param": "error",
      "jsdoc/require-returns": ["error", { forceRequireReturn: true }],
    },
  },
];
