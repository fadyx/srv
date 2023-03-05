import { Construct } from "constructs";
import * as aws from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { ISecret } from "aws-cdk-lib/aws-secretsmanager";

const IS_MULTI_AZ = false;
const BACKUP_RETENTION = 7;
const MONITORING_INTERVAL = 60;
const IS_PUBLICLY_ACCESSIBLE = false;
const HAS_DELETION_PROTECTION = true;
const PORT = 5432;

export type PostgreSqlRdsDbConstructProps = {
	vpc: ec2.Vpc;
	version: rds.PostgresEngineVersion;
	dbName: string;
	secret: ISecret;
	allocatedStorage: number;
	maxAllocatedStorage?: number;
	subnetType: ec2.SubnetType;
	instanceClass: ec2.InstanceClass;
	instanceSize: ec2.InstanceSize;

	removalPolicy?: aws.RemovalPolicy;
	port?: number;
	hasDeletionProtection?: boolean;
	isPubliclyAccessible?: boolean;
	storageType?: rds.StorageType;
	isMultiAz?: boolean;
	backupRetention?: number;
	vpcSecurityGroupIds?: string[];
};

export class PostgreSqlRdsDbConstruct extends Construct {
	public readonly db: rds.DatabaseInstance;

	public readonly sg: ec2.SecurityGroup;

	public readonly passwordSecretArn: string;

	constructor(scope: Construct, id: string, props: PostgreSqlRdsDbConstructProps) {
		super(scope, id);

		const port = props.port ?? PORT;

		const sg = new ec2.SecurityGroup(this, `${id}SecurityGroup`, { vpc: props.vpc });

		const vpcSgs =
			props.vpcSecurityGroupIds?.map((sgId) =>
				ec2.SecurityGroup.fromLookupById(this, sgId, sgId),
			) ?? [];

		const securityGroups: ec2.ISecurityGroup[] = [sg, ...vpcSgs];

		const { subnetIds } = props.vpc.selectSubnets({ subnetType: props.subnetType });

		const subnets = subnetIds.map((subnetId) =>
			ec2.Subnet.fromSubnetId(this, subnetId, subnetId),
		);

		const db = new rds.DatabaseInstance(this, "PostgreSQLRdsDB", {
			vpc: props.vpc,
			engine: rds.DatabaseInstanceEngine.postgres({ version: props.version }),
			credentials: rds.Credentials.fromSecret(props.secret),
			securityGroups,
			databaseName: props.dbName,
			multiAz: props.isMultiAz ?? IS_MULTI_AZ,
			port,
			allocatedStorage: props.allocatedStorage,
			removalPolicy: props.removalPolicy ?? aws.RemovalPolicy.RETAIN,
			maxAllocatedStorage: props.maxAllocatedStorage,
			storageType: props.storageType ?? rds.StorageType.STANDARD,
			enablePerformanceInsights: true,
			monitoringInterval: aws.Duration.seconds(MONITORING_INTERVAL),
			backupRetention: aws.Duration.days(props.backupRetention ?? BACKUP_RETENTION),
			instanceType: ec2.InstanceType.of(props.instanceClass, props.instanceSize),
			publiclyAccessible: props.isPubliclyAccessible ?? IS_PUBLICLY_ACCESSIBLE,
			instanceIdentifier: aws.PhysicalName.GENERATE_IF_NEEDED,
			deletionProtection: props.hasDeletionProtection ?? HAS_DELETION_PROTECTION,
			vpcSubnets: {
				availabilityZones: props.vpc.availabilityZones,
				subnets,
			},
		});

		if (props.isPubliclyAccessible) sg.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(port));

		this.sg = sg;
		this.db = db;
	}
}

export default PostgreSqlRdsDbConstruct;
