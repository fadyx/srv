import * as cdk from "aws-cdk-lib";
import { CfnOutput, Tags } from "aws-cdk-lib";
import { Construct } from "constructs";
import type { DeepReadonly } from "tsutils";
import { DeploymentEnvironment } from "@/constants";

export interface BaseStackProps
	extends Omit<cdk.StackProps, "stackName" | "terminationProtection"> {
	shared: boolean;
	environment: DeploymentEnvironment;
	deploymentId: string;
}

type Output = { value: string; description?: string };
type E = Record<string | number, string | number>;
type Outputs<T extends E> = keyof T extends never ? null : Record<keyof T, Output>;

export class BaseStack<OutputsEnum extends E = Record<never, never>> extends cdk.Stack {
	public readonly shared: boolean;

	public readonly deploymentId: string;

	protected _outputs: Outputs<OutputsEnum> & { _tag: "outputs" };

	get outputs(): DeepReadonly<Outputs<OutputsEnum>> {
		return this._outputs as unknown as DeepReadonly<Outputs<OutputsEnum>>;
	}

	protected constructOutputs(
		scope: Construct,
		outputs: Outputs<OutputsEnum>,
	): Outputs<OutputsEnum> & { _tag: "outputs" } {
		const createCfnOutput = (k: string, o: Output) =>
			new CfnOutput(scope, k, {
				value: o.value,
				exportName: `${this.stackName}${k}`,
				description: o.description,
			});
		if (outputs) Object.entries(outputs).forEach(([k, v]) => createCfnOutput(k, v));
		return outputs as Outputs<OutputsEnum> & { _tag: "outputs" };
	}

	static constructId(stackName: string, shared: boolean, deploymentId: string) {
		const prefix = shared ? "Shared" : deploymentId;
		const id = `${prefix}${stackName}`;
		return id;
	}

	public allocateLogicalId(element: cdk.CfnElement) {
		const original = super.allocateLogicalId(element);
		const id = BaseStack.constructId(original, this.shared, this.deploymentId);
		return id;
	}

	constructor(scope: Construct, id: string, props: BaseStackProps) {
		const sid = BaseStack.constructId(id, props.shared, props.deploymentId);

		const hasTerminationProtection = props.shared;

		super(scope, sid, {
			...props,
			terminationProtection: hasTerminationProtection,
			stackName: sid,
		});

		this.shared = props.shared;
		this.deploymentId = props.deploymentId;

		Tags.of(this).add("Shared", String(this.shared));
		Tags.of(this).add("DeploymentId", this.shared ? "Shared" : props.deploymentId);
	}
}

export default BaseStack;
