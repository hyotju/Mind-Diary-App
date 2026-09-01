"use client";

import Image from "next/image";
import Link from "next/link";
import type { FormEvent } from "react";

import BottomNavigation from "@/components/layout/BottomNavigation";
import { MAIN_NAVIGATION_ITEMS } from "@/constants/navigation";
import {
  ProfileEditField,
  ProfileNavigationField,
} from "@/features/user/components/profile/ProfileEditField";
import ProfileExitDialog from "@/features/user/components/profile/ProfileExitDialog";
import { useProfileEdit } from "@/features/user/hooks/useProfileEdit";
import { useUnsavedNavigation } from "@/features/user/hooks/useUnsavedNavigation";
import type { MemberProfile } from "@/features/user/types";
import {
  formatProfileBirthDate,
  formatProfileBirthTime,
} from "@/features/user/utils";

type ProfileGender = Exclude<MemberProfile["gender"], null>;

const GENDER_OPTIONS: Array<{ label: string; value: ProfileGender }> = [
  { label: "여성", value: "FEMALE" },
  { label: "남성", value: "MALE" },
  { label: "선택안함", value: "NONE" },
];

export default function ProfileEditPage() {
  const {
    birthDate,
    birthTime,
    canSave,
    error,
    gender,
    isDirty,
    isLoading,
    isSubmitting,
    name,
    phoneNumber,
    setBirthDate,
    setBirthTime,
    setGender,
    setName,
    submitProfile,
  } = useProfileEdit();
  const {
    cancelNavigation,
    confirmNavigation,
    handleNavigationCapture,
    isExitDialogOpen,
  } = useUnsavedNavigation(isDirty);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void submitProfile();
  };

  return (
    <main
      className="h-dvh overflow-hidden bg-gray-100 text-foreground"
      onClickCapture={handleNavigationCapture}
    >
      <div className="relative mx-auto h-dvh w-full max-w-[393px] overflow-hidden bg-background">
        <div className="h-full overflow-y-auto pb-[calc(116px+env(safe-area-inset-bottom))] pt-[25px]">
          <header className="grid h-7 grid-cols-[28px_1fr_28px] items-center px-6">
            <Link
              aria-label="마이페이지로 돌아가기"
              className="flex size-7 items-center justify-center"
              href="/my"
            >
              <Image
                alt=""
                className="-rotate-90"
                height={28}
                src="/figma/my/back-arrow.svg"
                width={28}
              />
            </Link>
            <h1 className="text-center text-xl font-medium leading-[23px]">
              프로필
            </h1>
          </header>

          <div className="relative mx-auto mt-6 size-[120px]">
            <Image
              alt=""
              className="absolute inset-0 size-full"
              height={120}
              src="/figma/my/profile-edit-circle.svg"
              width={120}
            />
            <Image
              alt=""
              className="absolute left-8 top-[26px] h-[69px] w-[56px]"
              height={69}
              src="/figma/my/profile-edit-flame.svg"
              width={56}
            />
          </div>

          <form className="mx-8 mt-[45px]" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-[27px]">
              <ProfileEditField
                id="profile-name"
                label="이름"
                onChange={setName}
                placeholder="김마음"
                value={name}
              />
              <ProfileEditField
                id="profile-birth-date"
                inputMode="numeric"
                label="생년월일"
                onChange={(value) =>
                  setBirthDate(formatProfileBirthDate(value))
                }
                placeholder="YYYY/MM/DD"
                value={birthDate}
              />
              <ProfileEditField
                id="profile-birth-time"
                inputMode="numeric"
                label="태어난 시간"
                onChange={(value) =>
                  setBirthTime(formatProfileBirthTime(value))
                }
                placeholder="HH:MM"
                value={birthTime}
              />
              <ProfileNavigationField
                href="/my/profile/phone"
                label="전화번호"
                placeholder="010-0000-0000"
                value={phoneNumber}
              />
            </div>

            <fieldset className="mt-[27px]">
              <legend className="text-base font-semibold leading-[19px]">
                성별
              </legend>
              <div className="mt-[15px] flex gap-[11px]">
                {GENDER_OPTIONS.map((option) => {
                  const isSelected = gender === option.value;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={`h-9 rounded-[50px] border px-[15px] text-base leading-normal transition-colors ${
                        isSelected
                          ? "border-orange-500 bg-white text-orange-500"
                          : "border-gray-200 bg-gray-100 text-foreground"
                      }`}
                      key={option.value}
                      onClick={() => setGender(option.value)}
                      type="button"
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="relative mt-[108px]">
              {error ? (
                <p
                  aria-live="polite"
                  className="absolute bottom-[65px] left-0 right-0 text-center text-sm text-red-500"
                >
                  {error}
                </p>
              ) : null}
              <button
                className="h-[57px] w-full rounded-lg bg-orange-500 text-xl font-semibold leading-[23px] text-white disabled:bg-gray-300"
                disabled={!canSave}
                type="submit"
              >
                {isLoading
                  ? "불러오는 중"
                  : isSubmitting
                    ? "저장 중"
                    : "저장하기"}
              </button>
            </div>
          </form>
        </div>

        <BottomNavigation activeValue="my" items={MAIN_NAVIGATION_ITEMS} />

        {isExitDialogOpen ? (
          <ProfileExitDialog
            onContinue={cancelNavigation}
            onExit={confirmNavigation}
          />
        ) : null}
      </div>
    </main>
  );
}
