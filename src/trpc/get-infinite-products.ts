import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";
import { getPayloadClient } from "../get-payload";

export const getInfiniteProducts = router({
  getProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { sort, limit, ...queryOpts } = query;

      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.keys(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      const payload = await getPayloadClient();

      const {
        docs: item,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
        },
        sort,
        limit,
        depth: 1,
        page,
      });

      return {
        item,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});
