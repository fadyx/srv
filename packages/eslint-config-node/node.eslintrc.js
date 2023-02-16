module.exports = {
	root: true,
	env: {
		browser: false,
		es2021: true,
		node: true,
	},
	ignorePatterns: ["**/*.js", "node_modules", ".turbo", "dist", "coverage", ".eslintignore"],
	extends: [
		"turbo",
		"prettier",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"airbnb-base",
		"airbnb-typescript/base",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"plugin:@typescript-eslint/strict",
		"plugin:promise/recommended",
		"plugin:jsdoc/recommended",
		"plugin:security/recommended",
		"plugin:node/recommended",
		"plugin:eslint-comments/recommended",
		"plugin:prettier/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/recommended",
		"plugin:import/typescript",
	],
	overrides: [
		{
			files: ["**/__tests__/**/*.[jt]s", "**/?(*.)+(spec|test).[jt]s"],
			extends: ["plugin:jest/recommended"],
			rules: {
				"import/no-extraneous-dependencies": [
					"off",
					{ devDependencies: ["**/?(*.)+(spec|test).[jt]s"] },
				],
			},
			env: {
				jest: true,
			},
		},
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: ["./tsconfig.json"],
	},
	plugins: ["@typescript-eslint", "import", "prettier"],
	rules: {
		"node/no-unsupported-features/es-syntax": ["error", { ignores: ["modules"] }],
		"node/no-missing-import": "off",
		"@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
		"no-underscore-dangle": "off",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				leadingUnderscore: "allow",
				format: ["camelCase", "UPPER_CASE"],
				selector: ["variableLike"],
			},
			{
				selector: "variable",
				types: ["boolean"],
				format: ["PascalCase"],
				prefix: [
					"is",
					"should",
					"has",
					"can",
					"did",
					"will",
					"_is",
					"_should",
					"_has",
					"_can",
					"_did",
					"_will",
				],
			},
		],
	},
	settings: {
		"import/parsers": {
			"@typescript-eslint/parser": [".ts", ".d.ts"],
		},
		"import/resolver": {
			node: {
				extensions: [".js", ".ts"],
				moduleDirectory: ["node_modules", "src/"],
			},
		},
	},
};
