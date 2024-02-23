import {VerifyEmail} from "@/components/VerifyEmail";
import Image from "next/image";
import React from "react";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

const page = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className="w-full h-full text-center flex flex-col justify-center items-center">
      {token && typeof token === 'string' ? (
        <div className="pt-10 w-60 h-60">
          <VerifyEmail token= {token} />
        </div>
        ) : (
        <div className="pt-10 w-60 h-60">
          <div className="text-center">
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
            <h1 className="text-2xl font-bold text-gray-800">Check your email</h1>
            {toEmail ? (
              <h1 className="text-sm">
                We&apos; ve send you the confirmation Link to
                <span className="font-bold text-gray-600"> {toEmail}</span>
              </h1>
            ) : (
              <h1 className="text-sm">We&apos; ve send you the confirmation Link to your Email</h1>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
