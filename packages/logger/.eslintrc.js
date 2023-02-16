module.exports = {
	root: true,
	parserOptions: {
		tsconfigRootDir: __dirname,
		project: "./tsconfig.json",
	},
	extends: ["node"],
	rules: {},
	settings: {
		"import/resolver": {
			typescript: {
				alwaysTryTypes: true,
				project: __dirname,
			},
		},
	},
};
