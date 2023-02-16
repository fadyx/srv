import * as cdk from "aws-cdk-lib";

import { VpcConstruct } from "@/constructs/vpc.construct";
import { Construct } from "constructs";

export type InfrastructureStackProps = cdk.StackProps;

export class InfrastructureStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: InfrastructureStackProps) {
		super(scope, id, props);
		const _vpc = new VpcConstruct(this, "vpc", { name: "vpc", cidr: "10.10.0.0/16" });
	}
}
