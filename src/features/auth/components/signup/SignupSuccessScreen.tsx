import Image from "next/image";

import AuthPrimaryButton from "@/features/auth/components/common/AuthPrimaryButton";

type SignupSuccessScreenProps = {
  onSajuStart: () => void;
};

export default function SignupSuccessScreen({
  onSajuStart,
}: SignupSuccessScreenProps) {
  return (
    <section
      aria-labelledby="signup-success-title"
      className="absolute inset-0 bg-navy-900 text-orange-100"
    >
      <div className="absolute left-1/2 top-[216px] flex w-[281px] -translate-x-1/2 flex-col items-center text-center">
        <Image
          alt=""
          className="h-[142px] w-[162px] max-w-none"
          height={142}
          priority
          src="/figma/auth/login-character.svg"
          width={162}
        />
        <h1
          className="mt-[41px] text-[30px] font-bold leading-[35px] text-orange-400"
          id="signup-success-title"
        >
          환영해요!
        </h1>
        <p className="mt-6 text-base font-medium leading-[22px] text-orange-100">
          사주 정보를 입력하고
          <br />
          자세한 감정을 관찰 해볼까요?
        </p>
      </div>

      <div className="absolute inset-x-6 bottom-[50px]">
        <AuthPrimaryButton onClick={onSajuStart} type="button">
          사주 정보 입력하기
        </AuthPrimaryButton>
      </div>
    </section>
  );
}
