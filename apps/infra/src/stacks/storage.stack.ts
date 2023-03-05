import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as aws from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";

import { PostgreSqlRdsDbConstruct } from "@/constructs";
import { BaseStack, BaseStackProps } from "@/lib";

export type StorageStackProps = BaseStackProps & {
	vpc: ec2.Vpc;
	postgreSqlDb: {
		secretArn: string;
		dbName: string;
		instanceClass: ec2.InstanceClass;
		instanceSize: ec2.InstanceSize;
		subnetType: ec2.SubnetType;
		isPubliclyAccessible: boolean;
		removalPolicy: aws.RemovalPolicy;
		version: rds.PostgresEngineVersion;
		storageType: rds.StorageType;
		backupRetention: number;
		hasDeletionProtection: boolean;
		allocatedStorage: number;
		isMultiAz: boolean;
	};
};

export class StorageStack extends BaseStack {
	readonly postgreSqlDb: PostgreSqlRdsDbConstruct;

	constructor(scope: Construct, id: string, props: StorageStackProps) {
		super(scope, id, props);

		const postgreSqlDbSecret = rds.DatabaseSecret.fromSecretCompleteArn(
			this,
			"PostgreSqlDbSecret",
			props.postgreSqlDb.secretArn,
		);

		const postgreSqlDb = new PostgreSqlRdsDbConstruct(this, "PostgreSqlDb", {
			vpc: props.vpc,
			secret: postgreSqlDbSecret,
			vpcSecurityGroupIds: [],
			backupRetention: props.postgreSqlDb.backupRetention,
			hasDeletionProtection: props.postgreSqlDb.hasDeletionProtection,
			storageType: props.postgreSqlDb.storageType,
			removalPolicy: props.postgreSqlDb.removalPolicy,
			dbName: props.postgreSqlDb.dbName,
			allocatedStorage: props.postgreSqlDb.allocatedStorage,
			instanceClass: props.postgreSqlDb.instanceClass,
			instanceSize: props.postgreSqlDb.instanceSize,
			subnetType: props.postgreSqlDb.subnetType,
			isPubliclyAccessible: props.postgreSqlDb.isPubliclyAccessible,
			version: props.postgreSqlDb.version,
			isMultiAz: props.postgreSqlDb.isMultiAz,
		});

		this.postgreSqlDb = postgreSqlDb;
	}
}
