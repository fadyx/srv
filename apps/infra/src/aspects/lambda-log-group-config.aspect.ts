import { IConstruct } from "constructs";
import { IAspect } from "aws-cdk-lib";
import { CfnFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, LogGroupProps } from "aws-cdk-lib/aws-logs";

export class LambdaLogGroupConfig implements IAspect {
	#logGroupProps?: Omit<LogGroupProps, "logGroupName">;

	constructor(logGroupProps?: Omit<LogGroupProps, "logGroupName">) {
		this.#logGroupProps = logGroupProps;
	}

	visit(construct: IConstruct) {
		if (construct instanceof CfnFunction) {
			this.createLambdaLogGroup(construct);
		}
	}

	private createLambdaLogGroup(lambda: CfnFunction) {
		const _logGroup = new LogGroup(lambda, "LogGroup", {
			...this.#logGroupProps,
			logGroupName: `/aws/lambda/${lambda.ref}`,
		});
	}
}

export default LambdaLogGroupConfig;
