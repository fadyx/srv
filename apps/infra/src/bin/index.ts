import "source-map-support/register";

import path from "path";

import { config } from "dotenv";

import * as cdk from "aws-cdk-lib";
import { Annotations, IAspect, Tokenization } from "aws-cdk-lib";

import { InfrastructureStack } from "@/stacks/infrastructure.stack";
import { IConstruct } from "constructs";

config({ path: path.resolve(__dirname, "../../../../.env") });

class BucketVersioningChecker implements IAspect {
	public visit = (node: IConstruct): void => {
		// See that we're dealing with a CfnBucket
		if (node instanceof cdk.aws_s3.CfnBucket) {
			// Check for versioning property, exclude the case where the property
			// can be a token (IResolvable).
			if (
				!node.versioningConfiguration ||
				(!Tokenization.isResolvable(node.versioningConfiguration) &&
					node.versioningConfiguration.status !== "Enabled")
			) {
				Annotations.of(node).addError("Bucket versioning is not enabled");
			}
		}
	};
}

const init = () => {
	const app = new cdk.App();

	const infrastructureStack = new InfrastructureStack(app, "InfrastructureStack", {});
	cdk.Aspects.of(infrastructureStack).add(new BucketVersioningChecker());
};

init();
