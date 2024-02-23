"use client";

import { trpc } from "@/trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";

const ContextProvider = ({children}: PropsWithChildren) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({
    links : [httpBatchLink({
        url : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
        fetch(url,options){
            return fetch(url,{
                ...options,
                credentials : "include"
            })
        }
    })]
  }));

  return(
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )

};

export default ContextProvider;
