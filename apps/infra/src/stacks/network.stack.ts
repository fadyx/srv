import { Construct } from "constructs";

import { VpcConstruct } from "@/constructs";
import { BaseStack, BaseStackProps } from "@/lib";

export type NetworkStackProps = BaseStackProps & {
	vpc: { cidr: string; azs: number; natGateways: number };
};

export class NetworkStack extends BaseStack {
	public readonly vpc: VpcConstruct;

	constructor(scope: Construct, id: string, props: NetworkStackProps) {
		super(scope, id, props);

		const vpc = new VpcConstruct(this, "Vpc", {
			name: "Vpc",
			cidr: props.vpc.cidr,
			azs: props.vpc.azs,
			natGateways: props.vpc.natGateways,
		});

		this.vpc = vpc;
	}
}
