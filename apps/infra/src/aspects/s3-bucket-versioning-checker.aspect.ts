import * as cdk from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { IAspect, Annotations, Tokenization } from "aws-cdk-lib";

export class S3BucketVersioningChecker implements IAspect {
	public visit = (node: IConstruct): void => {
		if (node instanceof cdk.aws_s3.CfnBucket) {
			if (
				!node.versioningConfiguration ||
				(!Tokenization.isResolvable(node.versioningConfiguration) &&
					node.versioningConfiguration.status !== "Enabled")
			) {
				Annotations.of(node).addError("Bucket versioning is not enabled.");
			}
		}
	};
}

export default S3BucketVersioningChecker;
