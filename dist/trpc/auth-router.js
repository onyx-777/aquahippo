"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const account_credential_1 = require("../lib/validators/account-credential");
const trpc_1 = require("./trpc");
const get_payload_1 = require("../get-payload");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
exports.authRouter = (0, trpc_1.router)({
    createPayloadUser: trpc_1.publicProcedure
        .input(account_credential_1.AuthCredentialsValidator)
        .mutation(async ({ input }) => {
        const { email, password } = input;
        const payload = await (0, get_payload_1.getPayloadClient)();
        // check if user already exists
        const { docs: users } = await payload.find({
            collection: "users",
            where: {
                email: {
                    equals: email,
                },
            },
        });
        if (users.length !== 0)
            throw new server_1.TRPCError({ code: "CONFLICT" });
        await payload.create({
            collection: "users",
            data: {
                email,
                password,
                role: "user",
            },
        });
        return { success: true, sentToEmail: email };
    }),
    verifyEmail: trpc_1.publicProcedure
        .input(zod_1.z.object({ token: zod_1.z.string() }))
        .query(async ({ input }) => {
        const { token } = input;
        const payload = await (0, get_payload_1.getPayloadClient)();
        const isVerified = payload.verifyEmail({
            collection: "users",
            token,
        });
        if (!isVerified) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        }
        return { success: true };
    }),
    signIn: trpc_1.publicProcedure
        .input(account_credential_1.AuthCredentialsValidator)
        .mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        const { res } = ctx;
        const payload = await (0, get_payload_1.getPayloadClient)();
        try {
            await payload.login({
                collection: "users",
                data: {
                    email,
                    password,
                },
                res,
            });
            return ({ success: true });
        }
        catch (error) {
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        }
    }),
});
