import * as aws from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";

import { DeploymentEnvironment } from "@/constants";
import { env } from "./env";

// https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html

export type InfrastructureSettings = {
	network: {
		vpc: {
			azs: number;
			natGateways: number;
			cidr: string;
		};
	};
	secrets: {
		postgreSqlDbUsername: string;
	};
	storage: {
		pg: {
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
};

const productionInfrastructureSettings: InfrastructureSettings = {
	network: {
		vpc: { azs: 3, natGateways: 3, cidr: "10.13.0.0/16" },
	},
	secrets: {
		postgreSqlDbUsername: "root",
	},
	storage: {
		pg: {
			storageType: aws.aws_rds.StorageType.GP2,
			instanceClass: aws.aws_ec2.InstanceClass.T3,
			instanceSize: aws.aws_ec2.InstanceSize.MICRO,
			allocatedStorage: 10,
			backupRetention: 7,
			dbName: env.appId,
			isPubliclyAccessible: true,
			hasDeletionProtection: false,
			isMultiAz: false,
			removalPolicy: aws.RemovalPolicy.DESTROY,
			subnetType: ec2.SubnetType.PUBLIC,
			version: rds.PostgresEngineVersion.VER_14_6,
		},
	},
};

const stagingInfrastructureSettings: InfrastructureSettings = {
	network: {
		vpc: { azs: 2, natGateways: 1, cidr: "10.12.0.0/16" },
	},
	secrets: {
		postgreSqlDbUsername: "root",
	},
	storage: {
		pg: {
			storageType: aws.aws_rds.StorageType.GP2,
			instanceClass: aws.aws_ec2.InstanceClass.T3,
			instanceSize: aws.aws_ec2.InstanceSize.MICRO,
			allocatedStorage: 10,
			backupRetention: 7,
			dbName: env.appId,
			isPubliclyAccessible: true,
			hasDeletionProtection: false,
			isMultiAz: false,
			removalPolicy: aws.RemovalPolicy.DESTROY,
			subnetType: ec2.SubnetType.PUBLIC,
			version: rds.PostgresEngineVersion.VER_14_6,
		},
	},
};

const testingInfrastructureSettings: InfrastructureSettings = {
	network: {
		vpc: { azs: 2, natGateways: 1, cidr: "10.11.0.0/16" },
	},
	secrets: {
		postgreSqlDbUsername: "root",
	},
	storage: {
		pg: {
			storageType: aws.aws_rds.StorageType.GP2,
			instanceClass: aws.aws_ec2.InstanceClass.T3,
			instanceSize: aws.aws_ec2.InstanceSize.MICRO,
			allocatedStorage: 10,
			backupRetention: 7,
			dbName: env.appId,
			isPubliclyAccessible: true,
			hasDeletionProtection: false,
			isMultiAz: false,
			removalPolicy: aws.RemovalPolicy.DESTROY,
			subnetType: ec2.SubnetType.PUBLIC,
			version: rds.PostgresEngineVersion.VER_14_6,
		},
	},
};

export const config: Record<DeploymentEnvironment, InfrastructureSettings> = {
	[DeploymentEnvironment.PRODUCTION]: productionInfrastructureSettings,
	[DeploymentEnvironment.STAGING]: stagingInfrastructureSettings,
	[DeploymentEnvironment.TESTING]: testingInfrastructureSettings,
};
