"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  getMyProfile,
  ProfileApiError,
  updateMyProfile,
} from "@/features/user/api/profile";
import type { MemberProfile } from "@/features/user/types";
import {
  formatProfileBirthDate,
  formatProfileBirthTime,
  formatProfilePhoneNumber,
} from "@/features/user/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileEditStore } from "@/store/useProfileEditStore";
import { useUserStore } from "@/store/useUserStore";

type ProfileGender = Exclude<MemberProfile["gender"], null>;

export function useProfileEdit() {
  const router = useRouter();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const clearVerifiedPhoneNumber = useProfileEditStore(
    (state) => state.clearVerifiedPhoneNumber,
  );
  const verifiedPhoneNumber = useProfileEditStore(
    (state) => state.verifiedPhoneNumber,
  );
  const clearProfile = useUserStore((state) => state.clearProfile);
  const setProfile = useUserStore((state) => state.setProfile);
  const [originalProfile, setOriginalProfile] = useState<MemberProfile | null>(
    null,
  );
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState<ProfileGender>("NONE");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const verifiedPhoneNumberAtMount =
      useProfileEditStore.getState().verifiedPhoneNumber;

    void getMyProfile(controller.signal)
      .then((profile) => {
        setOriginalProfile(profile);
        setProfile(profile);
        setName(profile.name);
        setBirthDate(formatProfileBirthDate(profile.birthDate ?? ""));
        setBirthTime(formatProfileBirthTime(profile.birthTime ?? ""));
        setPhoneNumber(
          formatProfilePhoneNumber(
            verifiedPhoneNumberAtMount ?? profile.phoneNumber,
          ),
        );
        setGender(profile.gender ?? "NONE");
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            loadError instanceof ProfileApiError
              ? loadError.message
              : "프로필을 불러오지 못했어요.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [setProfile]);

  const canSave = useMemo(() => {
    const birthDateDigits = getDigits(birthDate);
    const birthTimeDigits = getDigits(birthTime);
    const phoneNumberDigits = getDigits(phoneNumber);
    const originalPhoneNumber = getDigits(originalProfile?.phoneNumber ?? "");
    const phoneChanged = phoneNumberDigits !== originalPhoneNumber;
    const phoneVerified =
      !phoneChanged || phoneNumberDigits === verifiedPhoneNumber;

    return (
      !isLoading &&
      !isSubmitting &&
      name.trim().length > 0 &&
      birthDateDigits.length === 8 &&
      (birthTimeDigits.length === 0 || birthTimeDigits.length === 4) &&
      phoneNumberDigits.length === 11 &&
      phoneVerified
    );
  }, [
    birthDate,
    birthTime,
    isLoading,
    isSubmitting,
    name,
    originalProfile?.phoneNumber,
    phoneNumber,
    verifiedPhoneNumber,
  ]);

  const isDirty = useMemo(() => {
    if (!originalProfile || isLoading) {
      return false;
    }

    return (
      name !== originalProfile.name ||
      getDigits(birthDate) !== getDigits(originalProfile.birthDate ?? "") ||
      getDigits(birthTime) !== getDigits(originalProfile.birthTime ?? "") ||
      getDigits(phoneNumber) !== getDigits(originalProfile.phoneNumber) ||
      gender !== (originalProfile.gender ?? "NONE")
    );
  }, [
    birthDate,
    birthTime,
    gender,
    isLoading,
    name,
    originalProfile,
    phoneNumber,
  ]);

  const submitProfile = async (): Promise<void> => {
    if (!canSave) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await updateMyProfile({
        birthDate: getDigits(birthDate),
        birthTime: birthTime ? formatProfileBirthTime(birthTime) : null,
        gender,
        name: name.trim(),
        phoneNumber: getDigits(phoneNumber),
      });

      clearVerifiedPhoneNumber();
      setProfile(result.profile);

      if (result.reauthenticationRequired) {
        clearTokens();
        clearProfile();
        router.replace("/onboarding");
        return;
      }

      router.replace("/my");
    } catch (submitError) {
      setError(
        submitError instanceof ProfileApiError
          ? submitError.message
          : "프로필을 수정하지 못했어요.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}

function getDigits(value: string): string {
  return value.replace(/\D/g, "");
}
