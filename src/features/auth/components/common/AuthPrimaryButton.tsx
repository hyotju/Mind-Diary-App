import type { ButtonHTMLAttributes } from "react";

type AuthPrimaryButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function AuthPrimaryButton({
  className = "",
  variant = "navy",
  ...props
}: AuthPrimaryButtonProps & { variant?: "light" | "navy" }) {
  return (
    <button
      className={`h-[57px] w-full rounded-lg text-lg font-semibold leading-[23px] disabled:cursor-not-allowed ${
        variant === "light"
          ? "bg-orange-500 text-white disabled:bg-gray-100 disabled:text-gray-400"
          : "bg-orange-400 text-navy-900 disabled:opacity-50"
      } ${className}`}
      {...props}
    />
  );
}
