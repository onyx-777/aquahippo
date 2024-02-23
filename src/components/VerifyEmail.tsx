"use client";
import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/button";

interface VerificationToken {
  token: string;
}

export const VerifyEmail = ({ token }: VerificationToken) => {
  const { isError, isLoading, data } = trpc.auth.verifyEmail.useQuery({
    token,
  });

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center w-full gap-5">
        <div className="text-center flex flex-col justify-center items-center gap-4">
          <XCircle className="h-8 w-8 text-red-600" />
          <h1 className="font-bold text-xl">There was a problem </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          This token is not valid or might be expired. Please try again later
        </p>
      </div>
    );
  }

  if (data?.success) {
    return (
      <div className="pt-20 w-60 h-60">
        <div className="text-center w-full">
          <Image
            src={"/hippo-email-sent.png"}
            alt="Email Sent"
            width={400}
            height={400}
            priority
            className="w-full ml-7"
          />
        </div>
        <div className="w-80 text-muted-foreground text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            You&apos;r all set!
          </h1>
          <p className="text-muted-foreground text-center mt-1">
            Thank you for verifying your Email
          </p>
          <div className=" h-44 pt-7">
            <Button variant={"default"}>
              <Link href={"/sign-in"}>Sign-in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center w-full gap-5">
        <div className="text-center flex flex-col justify-center items-center gap-4">
          <Loader2 className="animate-spin h-8 w-8 text-zinc-300" />
          <h1 className="font-bold text-xl">Verifying... </h1>
        </div>
        <p className="text-muted-foreground text-sm">
          This won&apos;t take long
        </p>
      </div>
    );
  }
};
