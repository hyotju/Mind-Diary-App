import Image from "next/image";

type SignupHeaderProps = {
  onBack: () => void;
  title?: string;
};

export default function SignupHeader({
  onBack,
  title = "회원가입",
}: SignupHeaderProps) {
  return (
    <header className="absolute left-6 right-6 top-[70px] flex h-7 items-center justify-center">
      <button
        aria-label="이전 화면"
        className="absolute left-0 flex size-7 items-center justify-center"
        onClick={onBack}
        type="button"
      >
        <Image
          alt=""
          className="-rotate-90"
          height={28}
          src="/figma/my/back-arrow.svg"
          width={28}
        />
      </button>
      <h1 className="text-xl font-medium leading-[23px] text-foreground">
        {title}
      </h1>
    </header>
  );
}
