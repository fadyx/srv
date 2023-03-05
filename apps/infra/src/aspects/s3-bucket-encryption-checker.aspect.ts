import * as cdk from "aws-cdk-lib";
import { IConstruct } from "constructs";
import { Annotations } from "aws-cdk-lib";

export class S3BucketEncryptionChecker implements cdk.IAspect {
	public visit(node: IConstruct): void {
		if (node instanceof cdk.aws_s3.CfnBucket && !node.bucketEncryption) {
			Annotations.of(node).addError("Bucket encryption is not enabled.");
		}
	}
}

export default S3BucketEncryptionChecker;
