"use client";
import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credential";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trpc } from "@/trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ZodError } from "zod";
import { cn } from "@/lib/utils";

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isSeller = searchParams.get("as")==="seller";
  const origin = searchParams.get("origin")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess : () =>{
      toast.success("Signed in successfully");

      router.refresh();

      if (origin) {
        router.push(`/${origin}`)
        return;
      }

      if (isSeller) {
        router.push('/sell')
        return;
      }

      router.push('/')
      router.refresh()
    },

    onError : (err) =>{
      if(err.data?.code === 'UNAUTHORIZED'){
        toast.error("Invalid credentials")
      }
    }
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password });
  };

  const continueAsSeller = () =>{
    router.push('?as=seller')
  }

  const continueAsBuyer = () =>{
    router.replace("/sign-in", undefined)
  }

  return (
    <div className="w-full pt-20 flex justify-center items-center">
      <div className="flex flex-col w-full justify-center items-center gap-8">
        <Icons.logo className="w-[5rem] h-[5rem]" />
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl text-center">
            Sign in to your {isSeller && "Seller"} Account
          </h1>
          <Link
            href={"/sign-up"}
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5 font-semibold text-center",
            })}
          >
            Don&apos; have an account? Sign-up
          </Link>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className={cn({
                "focus-visible:ring-red-500 w-96 md:w-80 lg:w-[25rem]":
                  errors.email,
              })}
            />
            {errors?.email && (
              <p className="text-red-500 text-muted-foreground">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              type="password"
              placeholder="Password"
              className={cn({
                "focus-visible:ring-red-500 w-96 md:w-80 lg:w-[25rem]":
                  errors.password,
              })}
            />
            {errors?.password && (
              <p className="text-red-500 text-muted-foreground">
                {errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Button className="w-96 md:w-80 lg:w-[25rem]">Sign-in</Button>
          </div>
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 flex items-center"
            >
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            {
              isSeller ? (<Button variant={"secondary"} disabled={isLoading} onClick={continueAsBuyer}>Continue as Customer</Button>) : (<Button variant={"secondary"} disabled={isLoading} onClick={continueAsSeller}>Continue as seller</Button>)
            }
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
