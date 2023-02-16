import { Construct } from "constructs";
import { aws_ec2 as ec2, Stack, StackProps } from "aws-cdk-lib";

export interface VpcConstructProps extends StackProps {
	name: string;
	cidr: string;
	maxAzs?: number;
}

export class VpcConstruct extends Construct {
	readonly vpc: ec2.Vpc;

	constructor(scope: Construct, id: string, props: VpcConstructProps) {
		super(scope, id);

		const { stackName } = Stack.of(this);

		const vpc: ec2.Vpc = new ec2.Vpc(this, props.name, {
			cidr: props.cidr,
			vpcName: `${stackName}-vpc`,
			enableDnsSupport: true,
			enableDnsHostnames: true,
			maxAzs: props.maxAzs,
			natGateways: 0,
			subnetConfiguration: [
				{
					cidrMask: 24,
					name: "ingress",
					subnetType: ec2.SubnetType.PUBLIC,
				},
				{
					cidrMask: 24,
					name: "private-isolated",
					subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
				},
				// {
				// 	name: "private-nat",
				// 	subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
				// 	cidrMask: 24,
				// },
			],
		});

		const sg = ec2.SecurityGroup.fromSecurityGroupId(
			scope,
			"DefaultSecurityGroup",
			vpc.vpcDefaultSecurityGroup,
		);

		sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.icmpPing(), "Allow ping from anywhere");

		sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "allow SSH access from anywhere");

		this.vpc = vpc;
	}
}
