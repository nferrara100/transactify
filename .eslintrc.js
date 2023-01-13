module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: ["eslint:recommended"],
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    rules: {
        "sort-imports": "error",
        "sort-keys": "error",
        "sort-vars": "error",
    },
};
