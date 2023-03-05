import * as cdk from "aws-cdk-lib";
import { IConstruct } from "constructs";
import * as cloudformation from "aws-cdk-lib/aws-cloudformation";
import { BaseStack } from "@/lib";

interface StackPolicyAspectProps {
	stackPolicy: cdk.aws_iam.CfnPolicy;
	tagKey: string;
	tagValue: string;
}

export class StackPolicyAspect implements cdk.IAspect {
	private readonly props: StackPolicyAspectProps;

	constructor(props: StackPolicyAspectProps) {
		this.props = props;
	}

	public visit(node: IConstruct): void {
		if (node instanceof BaseStack && node.shared) {
			const cfnStack = node.node.defaultChild as cloudformation.CfnStack;
			cfnStack.applyRemovalPolicy(cdk.RemovalPolicy.RETAIN);
		}
	}
}

export default StackPolicyAspect;
