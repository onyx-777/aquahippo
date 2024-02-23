import { authRouter } from "./auth-router";
import { getInfiniteProducts } from "./get-infinite-products";
import { paymentRouter } from "./payment-router";
import { router } from "./trpc";

export const appRouter = router({
    auth : authRouter,
    getInfiniteProducts : getInfiniteProducts,
    payment: paymentRouter
});

export type AppRouter = typeof appRouter