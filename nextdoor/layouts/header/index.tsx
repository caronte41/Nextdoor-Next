import * as React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // shadcn avatar
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image"; // For optimized image loading in Next.js
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  //const [dropdownOpen, setDropdownOpen] = React.useState(false);
  return (
    <header className="w-full border-b shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Logo/Image */}
        <div className="flex items-center">
          <Image
            //src="https://github.com/shadcn.png" // Replace with your logo path
            alt="Logo"
            width={50}
            height={50}
            className="cursor-pointer"
          />
        </div>

        {/* Right side - Avatar */}
        <Popover>
          <PopoverTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="User Avatar"
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-4">
            <div className="flex flex-col space-y-2">
              <p className="text-sm font-medium">User Name</p>
              <button className="text-left w-full">Profile</button>
              <button className="text-left w-full">Settings</button>
              <button className="text-left w-full">Logout</button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}
