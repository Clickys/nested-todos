
module.exports = {
    extends: "airbnb-base",
    parserOptions: {
        ecmaVersion: 8,
    },
    env: {
        node: true,
        es6: true,
        browser: true,
    },
    rules: {
        "linebreak-style": 0,
        "no-multiple-empty-lines": 0,
        "no-unused-vars": [
            "error",
            {
                vars: "local",
                args: "none",
            },
        ],
        "func-names": ["error", "as-needed"],
        indent: [2, 4],

        // spacing
        "space-in-parens": [2, "always"],
        "template-curly-spacing": [2, "always"],
        "array-bracket-spacing": [2, "always"],
        "object-curly-spacing": [2, "always"],
        "computed-property-spacing": [2, "always"],
        "no-multiple-empty-lines": [2, { max: 1, maxEOF: 0, maxBOF: 0 }],

        // code arrangement matter
        "no-use-before-define": [2, { functions: false }],

        // make it meaningful
        "prefer-const": 1,

        // keep it simple
        complexity: [1, 5],
    },
};