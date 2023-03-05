// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as cdk from "aws-cdk-lib";
import { Tags } from "aws-cdk-lib";

import { DeploymentEnvironment } from "@/constants";
import { InfrastructureSettings } from "@/config";
import { NetworkStack, StorageStack, SecretsStack } from "@/stacks";
import { S3BucketEncryptionChecker, S3BucketVersioningChecker } from "@/aspects";

export type Tag = { key: string; value: string };

export type Deployment = {
	deploymentId: string;
	environment: DeploymentEnvironment;
	tags: Tag[];
	awsAccountId: string;
	awsDefaultRegion: string;
};

export const deploy = (deployment: Deployment, settings: InfrastructureSettings) => {
	const app = new cdk.App();

	const networkStack = new NetworkStack(app, "NetworkStack", {
		shared: true,
		environment: deployment.environment,
		deploymentId: deployment.deploymentId,
		env: { account: deployment.awsAccountId, region: deployment.awsDefaultRegion },

		vpc: settings.network.vpc,
	});

	const secretsStack = new SecretsStack(app, "SecretsStack", {
		shared: true,
		environment: deployment.environment,
		deploymentId: deployment.deploymentId,
		env: { account: deployment.awsAccountId, region: deployment.awsDefaultRegion },

		postgreSqlDbSecretUsername: settings.secrets.postgreSqlDbUsername,
	});

	const storageStack = new StorageStack(app, "StorageStack", {
		shared: false,
		environment: deployment.environment,
		deploymentId: deployment.deploymentId,
		env: { account: deployment.awsAccountId, region: deployment.awsDefaultRegion },

		vpc: networkStack.vpc.vpc,
		postgreSqlDb: {
			secretArn: secretsStack.outputs.postgreSqlDbSecretArn.value,
			allocatedStorage: settings.storage.pg.allocatedStorage,
			backupRetention: settings.storage.pg.backupRetention,
			dbName: settings.storage.pg.dbName,
			hasDeletionProtection: settings.storage.pg.hasDeletionProtection,
			instanceClass: settings.storage.pg.instanceClass,
			instanceSize: settings.storage.pg.instanceSize,
			isMultiAz: settings.storage.pg.isMultiAz,
			isPubliclyAccessible: settings.storage.pg.isPubliclyAccessible,
			removalPolicy: settings.storage.pg.removalPolicy,
			storageType: settings.storage.pg.storageType,
			subnetType: settings.storage.pg.subnetType,
			version: settings.storage.pg.version,
		},
	});

	// Other configurations, aspects, etc.
	deployment.tags.forEach((t) => Tags.of(app).add(t.key, t.value));
	cdk.Aspects.of(app).add(new S3BucketVersioningChecker());
	cdk.Aspects.of(app).add(new S3BucketEncryptionChecker());
};

export default deploy;
