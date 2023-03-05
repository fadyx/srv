module.exports = {
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	extends: ["node"],
	rules: {
		"node/no-unpublished-import": 0,
		"turbo/no-undeclared-env-vars": 0,
		"@typescript-eslint/consistent-type-definitions": ["error", "type"],
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
