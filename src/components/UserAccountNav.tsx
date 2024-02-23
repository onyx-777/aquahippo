"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button, buttonVariants } from "./ui/button";
import { User } from "@/payload-types";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

const UserAccountNav = ({ user }: { user: User }) => {
  const { signOut } = useAuth();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="relative">
          My Account
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="w-full flex flex-col justify-center items-start text-sm p-2 font-semibold">
          <div className="px-4 py-2 bg-zinc-50">
            <p>{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Button variant={"ghost"} className="mx-4">
            <Link href={"/sell"}>Sellers Dashboard</Link>
          </Button>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Button variant={"ghost"} className="mx-4" onClick={signOut}>
            Log out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
