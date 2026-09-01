import type { InputHTMLAttributes, ReactNode } from "react";

type SignupFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  endAdornment?: ReactNode;
  hasError?: boolean;
};

export default function SignupField({
  className = "",
  endAdornment,
  hasError = false,
  ...props
}: SignupFieldProps) {
  return (
    <div
      className={`flex h-[57px] w-full items-center rounded-lg border bg-white px-[17px] ${
        hasError ? "border-red-500" : "border-gray-400"
      } ${className}`}
    >
      <input
        className="min-w-0 flex-1 bg-transparent text-lg leading-[23px] text-foreground outline-none placeholder:text-gray-400"
        {...props}
      />
      {endAdornment}
    </div>
  );
}
