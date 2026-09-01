"use client";

import { useEffect, useRef, useState } from "react";

type BooleanSettings = Record<string, boolean>;
type SettingsUpdater<T extends BooleanSettings> = (request: T) => Promise<void>;
type SettingsLoader<T extends BooleanSettings> = () => Promise<T>;

export function useNotificationToggles<T extends BooleanSettings>(
  initialValues: T,
  loadSettings: SettingsLoader<T>,
  updateSettings: SettingsUpdater<T>,
) {
  const [values, setValues] = useState<T>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingKeys, setPendingKeys] = useState<Set<keyof T>>(new Set());
  const pendingKeysRef = useRef<Set<keyof T>>(new Set());
  const valuesRef = useRef<T>(initialValues);

  useEffect(() => {
    let isActive = true;

    void loadSettings()
      .then((settings) => {
        if (!isActive) return;
        valuesRef.current = settings;
        setValues(settings);
        setError(null);
        setIsLoading(false);
      })
      .catch((loadError: unknown) => {
        if (!isActive) return;
        setError(getErrorMessage(loadError));
        setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [loadSettings]);

  const toggle = async (key: keyof T): Promise<void> => {
    if (isLoading || pendingKeysRef.current.size > 0) {
      return;
    }

    const previousValues = valuesRef.current;
    const previousValue = previousValues[key];
    const nextValue = !previousValue;
    const nextValues = {
      ...previousValues,
      [key]: nextValue,
    };

    pendingKeysRef.current.add(key);
    setPendingKeys(new Set(pendingKeysRef.current));
    valuesRef.current = nextValues;
    setValues(nextValues);

    try {
      await updateSettings(nextValues);
      setError(null);
    } catch (error) {
      valuesRef.current = previousValues;
      setValues(previousValues);
      const message = getErrorMessage(error);
      setError(message);
      window.alert(message);
    } finally {
      pendingKeysRef.current.delete(key);
      setPendingKeys(new Set(pendingKeysRef.current));
    }
  };

  return {
    error,
    isLoading,
    isPending: (key: keyof T) =>
      isLoading || pendingKeys.has(key) || pendingKeys.size > 0,
    toggle,
    values,
  };
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "알림 설정을 변경하지 못했어요.";
}
