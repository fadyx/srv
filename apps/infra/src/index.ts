import "source-map-support/register";

import path from "path";

import dotenv from "dotenv";

import { env, config } from "@/config";

import { deploy, Deployment } from "@/bin";

dotenv.config({ path: path.resolve(__dirname, "./../../../.env") });

const infrastructureSettings = config[env.environment];

const deployment: Deployment = {
	deploymentId: env.deploymentId,
	environment: env.environment,
	awsAccountId: env.aws.awsAccountId,
	awsDefaultRegion: env.aws.awsDefaultRegion,
	tags: [{ key: "Environment", value: env.environment }],
};

deploy(deployment, infrastructureSettings);
