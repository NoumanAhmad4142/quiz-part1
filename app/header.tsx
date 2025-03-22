"use client";

import React, { useState } from "react";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Loader, Menu } from "lucide-react";
import { NavItems } from "@/components/navbar";
import { redirect } from "next/dist/server/api-utils";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Header() {
  const navItemsList = NavItems();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <Loader className="size-6 mr-4 mt-4 float-right animate-spin" />;
  }
  const avatarFallbackText = session?.user?.name?.charAt(0).toUpperCase() || "";

  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };

  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 justify-between bg-accent">
      <Link
        href="http://localhost:3000/"
        className="flex items-center gap-2 text-lg font-semibold md:text-base"
        prefetch={false}
      >
        <img
          className="w-13 h-13 border bg-accent rounded-full"
          src={"/Assets/logo.png"}
          alt="@shadcn"
        />
        <span className="text-2xl font-bold">EduChattor</span>
      </Link>

      <div className="flex justify-end">
        {session ? (
          <div className="ap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {session?.user?.name}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage
                        className="hover: opacity-75 transition"
                        src={session?.user?.image || undefined}
                        alt="@shadcn"
                      />
                      <AvatarFallback>{avatarFallbackText}</AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleSignOut()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div>
            <Button
              className="mr-4 bg-indigo-600 hover:bg-indigo-800"
              onClick={() => (window.location.href = "/login")}
            >
              LogIn
            </Button>
            <Button
              className="mr-4 bg-indigo-600 hover:bg-indigo-800"
              onClick={() => (window.location.href = "/register")}
            >
              Sign Up
            </Button>
          </div>
        )}
        <button onClick={() => setIsOpen(true)} className="block sm:hidden">
          <Menu size={24} />
        </button>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent side="right" className="block md:hidden">
            <div className="pt-4  overflow-y-auto h-fit w-full flex flex-col gap-1">
              {navItemsList.map((navItem, idx) => (
                <Link
                  key={idx}
                  href={navItem.href}
                  onClick={() => setIsOpen(false)}
                  className={`h-full relative flex items-center whitespace-nowrap rounded-md ${
                    navItem.active
                      ? "font-base text-sm bg-neutral-200 shadow-sm text-neutral-700 dark:bg-neutral-800 dark:text-white"
                      : "hover:bg-neutral-200  hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
                  }`}
                >
                  <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                    {navItem.icon}
                    <span>{navItem.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
