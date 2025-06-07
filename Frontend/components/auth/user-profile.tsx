"use client";

import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { signOut } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UserProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Get user initials for avatar fallback
  const getUserInitials = (user: User | null) => {
    if (!user || !user.email) return "?";
    
    // Try to get initials from email
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  // Get display name from user
  const getDisplayName = (user: User | null) => {
    if (!user) return "Guest";
    
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    
    if (user.email) {
      // Return everything before the @ in the email
      return user.email.split("@")[0];
    }
    
    return "User";
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center space-x-2 cursor-pointer">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarImage 
              src={user?.user_metadata?.avatar_url || ""} 
              alt={getDisplayName(user)} 
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {getUserInitials(user)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline-block">
            {getDisplayName(user)}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>{getDisplayName(user)}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="text-red-500 focus:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isSigningOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
