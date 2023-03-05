import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";

import { BaseStack, BaseStackProps } from "@/lib";

export type SecretsStackProps = BaseStackProps & { postgreSqlDbSecretUsername: string };

export enum SecretsStackOutputs {
	postgreSqlDbSecretArn,
}

export class SecretsStack extends BaseStack<typeof SecretsStackOutputs> {
	public readonly postgresQlDbPasswordSecret: rds.DatabaseSecret;

	constructor(scope: Construct, id: string, props: SecretsStackProps) {
		super(scope, id, props);

		const postgresQlDbPasswordSecret = new rds.DatabaseSecret(this, "PostgreSqlDbSecret", {
			username: props.postgreSqlDbSecretUsername,
		});

		this._outputs = this.constructOutputs(this, {
			postgreSqlDbSecretArn: {
				value: postgresQlDbPasswordSecret.secretArn,
				description: "ARN for the secret that holds the password for the PostgreSQL DB",
			},
		});

		this.postgresQlDbPasswordSecret = postgresQlDbPasswordSecret;
	}
}

export default SecretsStack;
