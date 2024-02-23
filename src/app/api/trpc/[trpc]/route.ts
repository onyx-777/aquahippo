import { appRouter } from '@/trpc'
import { authRouter } from '@/trpc/auth-router'
import {fetchRequestHandler} from '@trpc/server/adapters/fetch'

const handler = (req : Request) =>{
    fetchRequestHandler({
        req,
        endpoint : '/api/trpc/',
        router: appRouter,
        //@ts-expect-error context already passed from express middleware
        createContext : ()=>({})
    })
}

export {handler as GET , handler as POST}