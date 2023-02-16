const {
	APP_ID,
	AWS_ACCESS_KEY_ID,
	AWS_ACCOUNT_ID,
	AWS_DEFAULT_REGION,
	AWS_SECRET_ACCESS_KEY,
	ENVIRONMENT,
} = process.env;

export const env = {
	appId: APP_ID,
	awsAccessKeyId: AWS_ACCESS_KEY_ID,
	awsAccountId: AWS_ACCOUNT_ID,
	environment: ENVIRONMENT,
	awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
	awsDefaultRegion: AWS_DEFAULT_REGION,
} as const;

Object.entries(env).forEach(([k, v]) => {
	if (!v) throw new Error(`Missing environment variable "${k}".`);
});

export default env;
