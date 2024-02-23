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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ZodError } from "zod";
import { cn } from "@/lib/utils";

const Page = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("This email is already in use. Sign in instead?");

        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);

        return;
      }

      toast.error("Something went wrong");
    },

    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}`);
      router.push("/verify-email?to=" + sentToEmail);
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    mutate({ email, password });
  };

  return (
    <div className="w-full pt-20 flex justify-center items-center">
      <div className="flex flex-col w-full justify-center items-center gap-8">
        <Icons.logo className="w-[5rem] h-[5rem]" />
        <div>
          <h1 className="font-bold text-2xl text-center">Create an Account</h1>
          <Link
            href={"/sign-in"}
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5 font-semibold",
            })}
          >
            Already have an account? Sign-in
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
            {errors?.email && <p className="text-red-500 text-muted-foreground">{errors.email.message}</p>}
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
            {errors?.password && <p className="text-red-500 text-muted-foreground">{errors.password.message}</p>}
          </div>
          <div>
            <Button className="w-96 md:w-80 lg:w-[25rem]">Sign-up</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
