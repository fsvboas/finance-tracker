"use client";

import { forwardRef } from "react";
import { useAuth } from "../hooks/use-auth";

type UserAvatarProps = React.HTMLAttributes<HTMLDivElement>;

const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
  ({ className, ...props }, ref) => {
    const { user } = useAuth();

    const userName = user?.user_metadata?.display_name;
    const userInitial = userName?.trim()?.charAt(0)?.toUpperCase();

    return (
      <div
        ref={ref}
        className={`bg-transparent border rounded-full w-8 h-8 flex items-center justify-center ${
          className || ""
        }`}
        {...props}
      >
        <span className="text-sm font-bold text-white">{userInitial}</span>
      </div>
    );
  }
);

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
