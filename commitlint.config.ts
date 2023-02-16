import type { UserConfig } from "@commitlint/types";

const configurations: UserConfig = {
	extends: ["@commitlint/config-conventional"],
	parserPreset: {
		parserOpts: {
			issuePrefixes: ["PROJ-"],
		},
	},
	rules: {
		"scope-enum": [
			2,
			"always",
			[
				"[🪵]monorepo",
				"[🧩]api",
				"[☁️]infra",
				"[📦]logger",
				"[⚙️]jestconfig",
				"[⚙️]tsconfig",
				"[⚙️]eslint-config-node",
			],
		],
		"header-max-length": [2, "always", 100],
		"header-min-length": [2, "always", 3],
		"body-leading-blank": [1, "always"],
		"body-max-line-length": [2, "always", 100],
		"footer-leading-blank": [1, "always"],
		"footer-max-line-length": [2, "always", 100],
		"scope-case": [2, "always", "lower-case"],
		"scope-empty": [2, "never"],
		"subject-case": [2, "always", ["lower-case"]],
		"subject-empty": [2, "never"],
		"subject-full-stop": [2, "never", "."],
		"type-case": [2, "always", "lower-case"],
		"type-empty": [2, "never"],
		"type-enum": [
			2,
			"always",
			[
				"build",
				"changeset",
				"chore",
				"ci",
				"docs",
				"feat",
				"fix",
				"perf",
				"refactor",
				"revert",
				"security",
				"style",
				"test",
				"translation",
			],
		],
	},
};

module.exports = configurations;
