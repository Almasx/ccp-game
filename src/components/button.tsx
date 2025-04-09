import React from "react";
import { cn } from "~/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center",
        "bg-[#99CB39] text-white px-4 py-2 rounded-2xl font-semibold",
        "shadow-[0px_4px_0px_0px_rgba(111,137,46,1),inset_0px_2.4px_4.8px_0px_rgba(255,255,255,0.25),inset_0px_-2.4px_4.8px_0px_rgba(111,137,46,1)]",
        "active:shadow-[0px_1px_0px_0px_rgba(111,137,46,1),inset_0px_2.4px_4.8px_0px_rgba(255,255,255,0.25),inset_0px_-2.4px_4.8px_0px_rgba(111,137,46,1)]",
        "transition-all duration-200 hover:brightness-105 active:brightness-95",
        "active:translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
