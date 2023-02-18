#! /usr/bin node

const esbuild = require("esbuild");

const build = async () => {
	await esbuild.build({
		entryPoints: ["./src/index.ts"],
		bundle: true,
		outdir: "./dist/src",
		tsconfig: "./tsconfig.json",
		minify: true,
		write: true,
		sourcemap: true,
		minifyWhitespace: true,
		minifyIdentifiers: true,
		minifySyntax: true,
		platform: "node",
		target: "node18",
		treeShaking: true,
	});
};

build();
