import { Construct } from "constructs";
import { aws_ec2 as ec2, Stack } from "aws-cdk-lib";

const DEFAULT_AZS = 3;
const DEFAULT_NAT_GATEWAYS = 3;

export type VpcConstructProps = {
	name: string;
	cidr: string;
	azs?: number;
	natGateways?: number;
};

export class VpcConstruct extends Construct {
	readonly vpc: ec2.Vpc;

	readonly sg: ec2.ISecurityGroup;

	readonly azs: number;

	readonly natGateways: number;

	constructor(scope: Construct, id: string, props: VpcConstructProps) {
		super(scope, id);

		const { stackName } = Stack.of(this);

		const azs = props.azs ?? DEFAULT_AZS;

		const natGateways = props.natGateways ?? DEFAULT_NAT_GATEWAYS;

		const vpcName = `${stackName}Vpc`;

		const vpc: ec2.Vpc = new ec2.Vpc(this, props.name, {
			vpcName,
			ipAddresses: ec2.IpAddresses.cidr(props.cidr),
			enableDnsSupport: true,
			enableDnsHostnames: true,
			maxAzs: azs,
			natGateways,
			subnetConfiguration: [
				{
					name: `${vpcName}IngressSubnet`,
					subnetType: ec2.SubnetType.PUBLIC,
				},
				{
					name: `${vpcName}PrivateIsolatedSubnet`,
					subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
				},
				{
					name: `${vpcName}PrivateNatSubnet`,
					subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
				},
				{
					name: `${vpcName}ReservedSubnet`,
					subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
					reserved: true,
				},
			],
		});

		const sg = ec2.SecurityGroup.fromSecurityGroupId(
			scope,
			`${vpcName}DefaultSecurityGroup`,
			vpc.vpcDefaultSecurityGroup,
		);

		sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.icmpPing(), "Allow ping from anywhere.");

		sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), "Allow SSH access from anywhere.");

		this.vpc = vpc;
		this.sg = sg;
		this.azs = azs;
	}
}
