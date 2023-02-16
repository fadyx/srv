/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coveragePathIgnorePatterns: ["/node_modules/"],
	coverageProvider: "v8",
	resetMocks: false,
	rootDir: ".",
	modulePathIgnorePatterns: [
		"<rootDir>/test/__fixtures__",
		"<rootDir>/node_modules",
		"<rootDir>/dist",
	],
	transform: {
		"^.+\\.tsx?$": "ts-jest",
	},
	moduleDirectories: ["node_modules"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	roots: ["<rootDir>"],
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
	testPathIgnorePatterns: ["/node_modules/"],
	testRegex: [],
	verbose: true,
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
	},
};
