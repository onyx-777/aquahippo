"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const auth_router_1 = require("./auth-router");
const get_infinite_products_1 = require("./get-infinite-products");
const payment_router_1 = require("./payment-router");
const trpc_1 = require("./trpc");
exports.appRouter = (0, trpc_1.router)({
    auth: auth_router_1.authRouter,
    getInfiniteProducts: get_infinite_products_1.getInfiniteProducts,
    payment: payment_router_1.paymentRouter
});
