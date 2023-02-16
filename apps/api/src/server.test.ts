import supertest from "supertest";
import { describe, expect, it } from "@jest/globals";
import { createServer } from "@/server";

describe("server", () => {
	it("health check returns 200", async () => {
		await supertest(createServer())
			.get("/healthz")
			.expect(200)
			// eslint-disable-next-line promise/always-return
			.then((res) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(res.body.ok).toBe(true);
			});
	});

	it("message endpoint says hello", async () => {
		await supertest(createServer())
			.get("/message/jared")
			.expect(200)
			// eslint-disable-next-line promise/always-return
			.then((res) => {
				expect(res.body).toEqual({ message: "hello jared" });
			});
	});
});
