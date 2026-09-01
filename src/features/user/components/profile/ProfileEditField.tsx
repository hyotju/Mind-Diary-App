import Link from "next/link";

type ProfileEditFieldProps = {
  id: string;
  inputMode?: "numeric" | "tel";
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
};

export function ProfileEditField({
  id,
  inputMode,
  label,
  onChange,
  placeholder,
  value,
}: ProfileEditFieldProps) {
  return (
    <div className="relative flex flex-col gap-[11px]">
      <label
        className="h-[19px] text-base font-semibold leading-normal"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="h-4 w-full bg-transparent text-base leading-normal text-gray-300 outline-none placeholder:text-gray-300"
        id={id}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        value={value}
      />
      <span aria-hidden="true" className="h-px w-full bg-gray-300" />
    </div>
  );
}

type ProfileNavigationFieldProps = {
  href: string;
  label: string;
  placeholder: string;
  value: string;
};

export function ProfileNavigationField({
  href,
  label,
  placeholder,
  value,
}: ProfileNavigationFieldProps) {
  return (
    <Link className="relative flex flex-col gap-[11px]" href={href}>
      <span className="h-[19px] text-base font-semibold leading-normal">
        {label}
      </span>
      <span className="h-4 text-base leading-normal text-gray-300">
        {value || placeholder}
      </span>
      <span aria-hidden="true" className="h-px w-full bg-gray-300" />
    </Link>
  );
}
