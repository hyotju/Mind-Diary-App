"use client";

type NotificationToggleProps = {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: () => void;
};

export default function NotificationToggle({
  checked,
  disabled = false,
  label,
  onChange,
}: NotificationToggleProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={`relative h-[28px] w-[46px] shrink-0 rounded-full transition-colors duration-200 disabled:cursor-wait ${
        checked ? "bg-orange-400" : "bg-gray-300"
      }`}
      disabled={disabled}
      onClick={onChange}
      role="switch"
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute top-0.5 size-6 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-[left] duration-200 ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
