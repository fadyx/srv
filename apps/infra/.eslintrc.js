module.exports = {
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	extends: ["node"],
	rules: {
		"turbo/no-undeclared-env-vars": "warn",
		"class-methods-use-this": "off",
		"@typescript-eslint/consistent-type-definitions": "off",
	},
	settings: {
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
				project: __dirname,
			},
		},
	},
};
