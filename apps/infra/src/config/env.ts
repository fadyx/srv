import { z, ZodError } from "zod";

import { DeploymentEnvironment } from "@/constants";

const schema = z.object({
	appId: z.string(),
	environment: z.nativeEnum(DeploymentEnvironment),
	deploymentId: z.string().refine((d) => /^(Main|D[1-9]\d*)$/.test(d)),
	aws: z.object({
		awsAccountId: z.string(),
		awsDefaultRegion: z.string(),
		awsAccessKeyId: z.string(),
		awsSecretAccessKey: z.string(),
	}),
});

export type Env = ReturnType<(typeof schema)["parse"]>;

const formatValidationErrorMessage = (error: ZodError): string => {
	const errorMessage: string[] = [];

	const flattenedErrors = Object.entries(error.flatten().fieldErrors);

	flattenedErrors.forEach(([k, errs]) => {
		const msg = `The environment variable: "${k}" is invalid.`;
		const reason = errs?.length ? `Reason: ${errs.join(". ").concat(".")}` : "";
		errorMessage.push(`${msg} ${reason}`);
	});

	return errorMessage.join("\n");
};

const verifyEnv = (obj: typeof process.env) => {
	const {
		APP_ID,
		AWS_ACCESS_KEY_ID,
		AWS_ACCOUNT_ID,
		AWS_DEFAULT_REGION,
		AWS_SECRET_ACCESS_KEY,
		ENVIRONMENT,
		DEPLOYMENT_ID,
	} = obj;

	const e: Env = {
		appId: APP_ID,
		environment: ENVIRONMENT,
		deploymentId: DEPLOYMENT_ID,
		aws: {
			awsAccessKeyId: AWS_ACCESS_KEY_ID,
			awsAccountId: AWS_ACCOUNT_ID,
			awsSecretAccessKey: AWS_SECRET_ACCESS_KEY,
			awsDefaultRegion: AWS_DEFAULT_REGION,
		},
	};

	try {
		const env = schema.parse(e);
		return env;
	} catch (error) {
		throw new Error(formatValidationErrorMessage(error as ZodError));
	}
};

export const env = verifyEnv(process.env);

export default env;
