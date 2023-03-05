import { DeploymentEnvironment } from "@/constants";

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			APP_ID: string;
			DEPLOYMENT_ID: string;
			ENVIRONMENT: DeploymentEnvironment;
			AWS_DEFAULT_REGION: string;
			AWS_ACCOUNT_ID: string;
			AWS_ACCESS_KEY_ID: string;
			AWS_SECRET_ACCESS_KEY: string;
		}
	}
}
