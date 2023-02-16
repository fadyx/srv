import { CommitFunctions } from "@changesets/types";

const getAddMessage: CommitFunctions["getAddMessage"] = async (changeset) =>
	`docs(changesets): ${changeset.summary}`;

const getVersionMessage: CommitFunctions["getVersionMessage"] = async (releasePlan) => {
	const publishableReleases = releasePlan.releases.filter((release) => release.type !== "none");
	const numPackagesReleased = publishableReleases.length;

	const releasesLines = publishableReleases
		.map((release) => `\t${release.name}@${release.newVersion}`)
		.join("\n");

	const versionMessage =
		`chore(release): ${numPackagesReleased} package(s)` +
		"\n" +
		"Releases:" +
		"\n" +
		`${releasesLines}`;

	return versionMessage;
};

const defaultChangelogFunctions: CommitFunctions = { getAddMessage, getVersionMessage };

export default defaultChangelogFunctions;
